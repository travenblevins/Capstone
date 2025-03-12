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
  filename: 'logs/server-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  )
});


// Set up logging using Winston
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })

  ),
  transports: [
    logTransport,
    new winston.transports.Console(),
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


// Endpoint for user sign-up
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

// // Endpoint for user sign-up
// app.post("/signup/admin", async (req, res) => {
//   console.log(req.body); // Log the incoming request body to check its structure

//   // Ensure the request body is correctly destructured
//   const { firstName, lastName, email, password, admin } = req.body;

//   if (!firstName || !lastName || !email || !password || !admin) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   // Hash the password
//   const hashedPassword = bcrypt.hashSync(password, 10);

//   try {
//     await client.query("BEGIN"); // Start transaction

//     // Insert the user into the users table and return user details
//     const userResult = await client.query(
//       `INSERT INTO users (first_name, last_name, email, password, admin)
//        VALUES ($1, $2, $3, $4, $5)
//        RETURNING id, first_name, last_name, email, admin`,
//       [firstName, lastName, email, hashedPassword, admin]
//     );

//     const newUser = userResult.rows[0]; // Store the newly created user

//     // Insert the user into the administrators table
//     await client.query(
//       `INSERT INTO administrators (first_name, last_name, email, password, is_super_admin)
//        VALUES ($1, $2, $3, $4, $5)`,
//       [newUser.first_name, newUser.last_name, newUser.email, hashedPassword, admin]
//     );

//     await client.query("COMMIT"); // Commit transaction

//     res.status(201).json({ message: "User created successfully", user: newUser });
//   } catch (err) {
//     await client.query("ROLLBACK"); // Rollback transaction if error occurs
//     console.error("Error creating user", err);
//     res.status(500).json({ error: "Error creating user" });
//   }
// });


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
    console.log("Admin:", admin);

    let isAdmin

    if (user.admin === 'yes') {
      isAdmin = true;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, admin: isAdmin },  // Ensure `admin` is always included
      secretKey,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.json({ message: "Login successful", token: token, admin: isAdmin });
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

app.put('/profile', authenticateToken, async (req, res) => {
  const userId = req.userId; // Get user ID from the token
  const { firstName, lastName, email } = req.body;
  try {
    const query = `
      UPDATE users
      SET first_name = $1, last_name = $2, email = $3
      WHERE id = $4 RETURNING id, first_name, last_name, email
    `;
    const values = [firstName, lastName, email, userId];
    const result = await client.query(query, values);
    const updatedUser = result.rows[0];
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error updating user", err);
    res.status(500).json({ error: "Error updating user" });
  }

});


app.get("/courses", authenticateToken, async (req, res) => {
  try {
    // Query to fetch data from the 'courses' table
    const result = await client.query("SELECT * FROM courses");  // Query for the courses table

    // Formatting the response data (optional)
    const formattedCourses = result.rows.map(course => ({
      course_id: course.course_code,
      name: course.course_name,
      description: course.description,
      schedule: course.schedule,
      room: course.room,
      fee: course.fee
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
  try {
    // Use jwt.verify() to properly verify and decode the token
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);

    if (decoded.admin === true) {
      try {
        // Query to fetch data from the 'courses' table
        const result = await client.query("SELECT * FROM courses");
        const users = await client.query("SELECT * FROM users");
        const userTable = await client.query('SELECT * FROM user_courses')

        // Formatting the response data (optional)
        const formattedCourses = result.rows.map(course => ({
          course_id: course.course_code,
          name: course.course_name,
          description: course.description,
          schedule: course.schedule,
          room: course.room,
          fee: course.fee
        }));

        const formattedUsers = users.rows.map(user => ({
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          admin: user.admin
        }));

        const formattedUserTable = userTable.rows.map(user => ({
          user_id: user.user_id,
          course_code: user.course_code
        }))

        // Send formatted data as a JSON response
        res.json({
          totalCourses: formattedCourses.length,
          courses: formattedCourses,
          totalUsers: formattedUsers.length,
          users: formattedUsers,
          totalCourseUsers: formattedUserTable.length,
          userTable: formattedUserTable
        });

      } catch (err) {
        console.error("Error fetching data", err);
        res.status(500).send("Error fetching data");
      }
    } else {
      res.status(403).json({ error: "You are unauthorized and cannot access this page" });
    }
  } catch (err) {
    console.error("Error verifying token", err);
    res.status(401).json({ error: "Invalid token" });
  }
});


app.delete('/admin/users/:user_id', authenticateToken, async (req, res) => {
  const userId = req.params.user_id;
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);

    if (decoded.admin === true) {
      const query = "DELETE FROM users WHERE id = $1";
      await client.query(query, [userId]);
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(403).json({ error: "You are unauthorized and cannot access this page" });
    }
  } catch (err) {
    console.error("Error verifying token", err);
    res.status(401).json({ error: "Invalid token" });
  }
});

app.post('/admin/users', authenticateToken, async (req, res) => {
  const { firstName, lastName, email, password, admin } = req.body;

  if (!firstName || !lastName || !email || !password || !admin) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);
    if (decoded.admin === true) {
      const query = `
      INSERT INTO users (first_name, last_name, email, password, admin)
      VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, email, admin
    `;
      const values = [firstName, lastName, email, hashedPassword, admin];
      const result = await client.query(query, values);
      const newUser = result.rows[0];

      res.status(201).json({ message: "User created successfully", user: newUser });
    } else {
      res.status(403).json({ error: "You are unauthorized and cannot access this page" });
    }

  } catch (err) {
    console.error("Error creating user", err);
    res.status(500).json({ error: "Error creating user" });
  }
});

app.put('/admin/users/:user_id', authenticateToken, async (req, res) => {

  const userId = req.params.user_id;
  const { firstName, lastName, email, password, admin } = req.body;

  if (!firstName || !lastName || !email || !password || !admin) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);
    if (decoded.admin === true) {
      const query = `
      UPDATE users
      SET first_name = $1, last_name = $2, email = $3, password = $4, admin = $5
      WHERE id = $6 RETURNING id, first_name, last_name, email, admin
    `;
      const values = [firstName, lastName, email, hashedPassword, admin, userId];
      const result = await client.query(query, values);
      const updatedUser = result.rows[0];

      res.json({ message: "User updated successfully", user: updatedUser });
    } else {
      res.status(403).json({ error: "You are unauthorized and cannot access this page" });
    }

  } catch (err) {
    console.error("Error updating user", err);
    res.status(500).json({ error: "Error updating user" });
  }
});

app.delete('/admin/courses/:course_code', authenticateToken, async (req, res) => {
  const courseCode = req.params.course_code;
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);

    if (decoded.admin === true) {
      const query = "DELETE FROM courses WHERE course_code = $1";
      await client.query(query, [courseCode]);
      res.json({ message: "Course deleted successfully" });
    } else {
      res.status(403).json({ error: "You are unauthorized and cannot access this page" });
    }
  } catch (err) {
    console.error("Error verifying token", err);
    res.status(401).json({ error: "Invalid token" });
  }
});

app.post('/admin/courses', authenticateToken, async (req, res) => {
  const { courseCode, courseName, description, schedule, room, capacity, credits, fee } = req.body;

  if (!courseCode || !courseName || !description || !schedule || !room || !capacity || !credits || !fee) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);
    if (decoded.admin === true) {
      const query = `
      INSERT INTO courses (course_code, course_name, description, schedule, room, capacity, credits, fee)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING course_code, course_name, description, schedule, room, capacity, credits, fee
    `;
      const values = [courseCode, courseName, description, schedule, room, capacity, credits, fee];
      const result = await client.query(query, values);
      const newCourse = result.rows[0];

      res.status(201).json({ message: "Course created successfully", course: newCourse });
    } else {
      res.status(403).json({ error: "You are unauthorized and cannot access this page" });
    }

  } catch (err) {
    console.error("Error creating course", err);
    res.status(500).json({ error: "Error creating course" });
  }
});

app.put('/admin/courses/:course_code', authenticateToken, async (req, res) => {
  const courseCode = req.params.course_code;
  const { courseName, description, schedule, room, fee } = req.body;

  if (!courseName || !description || !schedule || !room || !fee) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);
    if (decoded.admin === true) {
      const query = `
      UPDATE courses
      SET course_name = $1, description = $2, schedule = $3, room = $4, fee = $5
      WHERE course_code = $6 RETURNING course_code, course_name, description, schedule, room, fee
    `;
      const values = [courseName, description, schedule, room, fee, courseCode];
      const result = await client.query(query, values);
      const updatedCourse = result.rows[0];

      res.json({ message: "Course updated successfully", course: updatedCourse });
    } else {
      res.status(403).json({ error: "You are unauthorized and cannot access this page" });
    }
  } catch (err) {
    console.error("Error updating course", err);
    res.status(500).json({ error: "Error updating course" });
  }

});

app.post("/admin/users/:user_id/:course_code/enroll", authenticateToken, async (req, res) => {
  const userId = req.params.user_id;
  const courseCode = req.params.course_code;

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);
    if (decoded.admin === true) {
      const query = "SELECT * FROM user_courses WHERE user_id = $1 AND course_code = $2";
      const result = await client.query(query, [userId, courseCode]);

      if (result.rows.length > 0) {
        res.json({ message: 'Already enrolled: ', enrollment: result.rows[0] });
      }

      const insertQuery = "INSERT INTO user_courses (user_id, course_code) VALUES ($1, $2) RETURNING *";
      const insertValues = [userId, courseCode];
      const insertResult = await client.query(insertQuery, insertValues);
      const enrollment = insertResult.rows[0];
      res.status(201).json({ message: "Successfully enrolled user in course", enrollment });

    } else {
      res.status(403).json({ error: "You are unauthorized and cannot access this page" });
    }
  } catch (err) {
    console.error("Error verifying token", err);
    res.status(401).json({ error: "Invalid token" });
  }
});

app.delete('/admin/users/:user_id/:course_code/unenroll', authenticateToken, async (req, res) => {
  const userId = req.params.user_id;
  const courseCode = req.params.course_code;

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);
    if (decoded.admin === true) {
      const query = "SELECT * FROM user_courses WHERE user_id = $1 AND course_code = $2";
      const result = await client.query(query, [userId, courseCode]);

      if(result.rows.length === 0) {
        return res.status(404).json({ error: "User not enrolled in this course" });
      }

      const deleteQuery = "DELETE FROM user_courses WHERE user_id = $1 AND course_code = $2 RETURNING *";
      const deleteValues = [userId, courseCode];
      const deleteResult = await client.query(deleteQuery, deleteValues);
      const enrollment = deleteResult.rows[0];
      res.json({ message: "Successfully unenrolled user from course", enrollment });
    }
  } catch (err) {
    console.error("Error verifying token", err);
    res.status(401).json({ error: "Invalid token" });
  }
});



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});