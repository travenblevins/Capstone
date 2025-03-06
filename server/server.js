// server/server.js

const express = require("express");
const morgan = require("morgan");
const winston = require("winston");
require('winston-daily-rotate-file');
const bcrypt = require("bcryptjs"); // Import the bcrypt module
const app = express();
const jwt = require("jsonwebtoken");
const path = require("path");
const { Client } = require("pg"); // Import the pg module
require("dotenv").config(); // Load environment variables from .env file
const secretKey = process.env.SECRET_KEY || "secret_key";
const cors = require("cors");
// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/dist")));
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;

const logTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/server-%DATE%.log',  // Log files will be saved in 'logs' folder with a date suffix
  datePattern: 'YYYY-MM-DD',           // Rotate logs daily
  zippedArchive: true,                 // Compress rotated logs to save space
  maxSize: '20m',                      // Rotate log after it reaches 20 MB
  maxFiles: '14d'                      // Keep log files for the past 14 days
});

// Set up logging using Winston
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    logTransport,
    new winston.transports.Console(),
    new winston.transports.File({ filename: "server.log" })
  ],
});


// Set up Morgan to log HTTP requests
app.use(morgan("combined", {
  stream: {
    write: message => logger.info(message.trim())
  }
}))

app.use((err, req, res, next) => {
  logger.error(`Error ${err.message}`);
  res.status(500).json({ error: "Internal Server Error" })
})

// Set up PostgreSQL client using environment variables
const client = new Client({
  user: process.env.PG_USER,         // Your PostgreSQL username
  host: process.env.PG_HOST,         // Usually 'localhost' or an IP address
  database: process.env.PG_DATABASE, // Your database name
  password: process.env.PG_PASSWORD, // Your PostgreSQL password
  port: process.env.PG_PORT || 5432, // Default PostgreSQL port is 5432
  ssl: {
    rejectUnauthorized: false
  }
});


// Connect to PostgreSQL
client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden" });
    }

    req.userId = user.userId; // Assuming the JWT payload contains 'userId'
    next();
  });
};


// Endpoint for user sign-upf
app.post("/signup", async (req, res) => {
  console.log(req.body); // Log the incoming request body to check its structure

  // Ensure the request body is correctly destructured
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    // Insert the user into the database, ensuring field names match the DB column names
    const query = `
      INSERT INTO users (first_name, last_name, email, password)
      VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email
    `;
    const values = [firstName, lastName, email, hashedPassword];

    // Execute the query and retrieve the result
    const result = await client.query(query, values);

    const newUser = result.rows[0];

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.error("Error creating user", err);
    res.status(500).json({ error: "Error creating user" });
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Find user by email
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await client.query(query, [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the plaintext password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);


    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const admin = user.admin;

    // Check if user is an admin
    if (admin === true) {
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        secretKey,
        { expiresIn: "1h" } // Token expires in 1 hour
      );

      res.json({ message: "Login successful", token: token, admin: true });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      secretKey,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.json({ message: "Login successful", token: token, admin: admin });
  } catch (err) {
    console.error("Error logging in", err);
    res.status(500).json({ error: "Error logging in" });
  }
});

app.get('/profile', authenticateToken, async (req, res) => {
  const userId = req.userId; // Get user ID from the token

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Fetch user details
    const userQuery = "SELECT id, first_name, last_name, email FROM users WHERE id = $1";
    const userResult = await client.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult.rows[0];

    // Fetch courses the user is enrolled in
    const coursesQuery = `
      SELECT c.course_code, c.course_name, c.description, c.credits, c.capacity, c.fee, c.schedule, c.room
      FROM user_courses uc
      JOIN courses c ON uc.course_code = c.course_code
      WHERE uc.user_id = $1
    `;
    const coursesResult = await client.query(coursesQuery, [userId]);

    res.json({
      user,
      enrolledCourses: coursesResult.rows,
    });
  } catch (err) {
    console.error("Error fetching user profile", err);
    res.status(500).json({ error: "Error fetching user profile", details: err.message });
  }
});




app.get("/courses", authenticateToken, async (req, res) => {
  try {
    // Query to fetch data from the 'courses' table
    const result = await client.query("SELECT * FROM courses");  // Query for the courses table

    // Formatting the response data (optional)
    const formattedCourses = result.rows.map(course => ({
      course_id: course.course_id,
      name: course.name,
      description: course.description,
      schedule: course.schedule,
      instructor: course.instructor,
      credits: course.credits,
      price: course.price
    }));

    // Send formatted data as a JSON response
    res.json({
      totalCourses: formattedCourses.length,  // Optional: include total count
      courses: formattedCourses
    });

  } catch (err) {
    console.error("Error fetching data", err);
    res.status(500).send("Error fetching data");
  }
});

app.get("/courses/:course_name", authenticateToken, async (req, res) => {
  const courseName = req.params.course_name;

  try {
    // Adjusted query with correct column name
    const query = "SELECT * FROM courses WHERE course_name = $1"; // Use the correct column name
    const result = await client.query(query, [courseName]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({ course: result.rows[0] });

  } catch (err) {
    console.error("Error fetching data", err);
    res.status(500).send("Error fetching data");
  }
});

app.post("/courses/:course_name/enroll", authenticateToken, async (req, res) => {
  console.log("Request body:", req.body); // Log the incoming body
  console.log("Request params:", req.params); // Log the incoming params
  const courseName = req.params.course_name;
  const userId = req.userId;  // Assuming the userId is retrieved from the decoded JWT

  try {
    // Check if the course exists by course_name
    console.log(`Checking if course ${courseName} exists...`);
    const courseQuery = "SELECT * FROM courses WHERE course_name = $1";
    const courseResult = await client.query(courseQuery, [courseName]);

    if (courseResult.rows.length === 0) {
      console.log(`Course ${courseName} not found`);
      return res.status(404).json({ error: "Course not found" });
    }

    // Get the course_code from the course
    const courseCode = courseResult.rows[0].course_code;

    // Check if the user is already enrolled in the course by course_code
    const enrollmentQuery = "SELECT * FROM user_courses WHERE user_id = $1 AND course_code = $2";
    const enrollmentResult = await client.query(enrollmentQuery, [userId, courseCode]);

    if (enrollmentResult.rows.length > 0) {
      console.log(`User ${userId} is already enrolled in course ${courseCode}`);
      return res.status(400).json({ error: "User is already enrolled in this course" });
    }

    // Enroll the user in the course
    const insertQuery = "INSERT INTO user_courses (user_id, course_code) VALUES ($1, $2) RETURNING *";
    const insertValues = [userId, courseCode];
    const insertResult = await client.query(insertQuery, insertValues);

    res.status(201).json({
      message: "Successfully enrolled in course",
      enrollment: insertResult.rows[0],
    });
  } catch (err) {
    console.error("Error enrolling user", err);
    res.status(500).json({ error: "Error enrolling user", details: err.message });
  }
});


app.post("/courses/:course_name/unenroll", authenticateToken, async (req, res) => {
  const courseName = req.params.course_name;
  const userId = req.userId;

  try {
    // Check if the course exists by course_name
    console.log(`Checking if course ${courseName} exists...`);
    const courseQuery = "SELECT * FROM courses WHERE course_name = $1";
    const courseResult = await client.query(courseQuery, [courseName]);

    if (courseResult.rows.length === 0) {
      console.log(`Course ${courseName} not found`);
      return res.status(404).json({ error: "Course not found" });
    }

    // Get the course_code from the course
    const courseCode = courseResult.rows[0].course_code;

    // Check if the user is already enrolled in the course by course_code
    console.log(`Checking if user ${userId} is already enrolled in course with code ${courseCode}`);
    const enrollmentQuery = "SELECT * FROM user_courses WHERE user_id = $1 AND course_code = $2";
    const enrollmentResult = await client.query(enrollmentQuery, [userId, courseCode]);

    if (enrollmentResult.rows.length > 0) {
      //unenroll user
      const deleteQuery = "DELETE FROM user_courses WHERE user_id = $1 AND course_code = $2 RETURNING *";
      const insertValues = [userId, courseCode];
      const insertResult = await client.query(deleteQuery, insertValues);

      console.log(`User ${userId} successfully unenrolled in course with code ${courseCode}`);
      res.status(201).json({
        message: "Successfully removed from this course",
        enrollment: insertResult.rows[0],
      });
    } else {
      console.log('User is not in this course')
    }

  } catch (err) {
    console.error("Error enrolling user", err);
    res.status(500).json({ error: "Error enrolling user", details: err.message });
  }
})

app.get("/admin", authenticateToken, async (req, res) => {
  const token = jwt.decode(req.headers.authorization.split(" ")[1]);
  if (token.admin === true) {
    try {
      // Query to fetch data from the 'courses' table
      const result = await client.query("SELECT * FROM courses");  // Query for the courses table

      // Formatting the response data (optional)
      const formattedCourses = result.rows.map(course => ({
        course_id: course.course_id,
        name: course.name,
        description: course.description,
        schedule: course.schedule,
        instructor: course.instructor,
        credits: course.credits,
        price: course.price
      }));

      // Send formatted data as a JSON response
      res.json({
        totalCourses: formattedCourses.length,  // Optional: include total count
        courses: formattedCourses
      });

    } catch (err) {
      console.error("Error fetching data", err);
      res.status(500).send("Error fetching data");
    }
  } else {
    res.status(403).json({ error: "You are unauthorized and cannot access this page" });
  }
})


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});