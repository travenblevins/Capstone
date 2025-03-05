// server/server.js

const express = require("express");
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
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden" });
    }

    req.user = user;
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

    // Compare hashed password with user input
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      secretKey,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.json({ message: "Login successful", token: token });
  } catch (err) {
    console.error("Error logging in", err);
    res.status(500).json({ error: "Error logging in" });
  }
});

app.get('/profile', authenticateToken, async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Find user by ID
    const query = "SELECT * FROM users WHERE id = $1";
    const result = await client.query(query, [userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error("Error fetching user", err);
    res.status(500).json({ error: "Error fetching user" });
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



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});