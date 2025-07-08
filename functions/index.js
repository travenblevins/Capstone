/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const express = require("express");
const morgan = require("morgan");
const winston = require("winston");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {Client} = require("pg");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Configure Firebase Functions config
const config = functions.config();
const secretKey = (config.app && config.app.secret_key) || "secret_key";
const databaseUrl = (config.database && config.database.url) ||
  process.env.DATABASE_URL;

// Set up logging using Winston
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({timestamp, level, message}) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
      }),
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

// Set up Morgan to log HTTP requests
app.use(morgan("combined", {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

// PostgreSQL client
const client = new Client({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false, // For production databases that require SSL
  },
});

// Connect to PostgreSQL
client.connect()
    .then(() => logger.info("Connected to PostgreSQL"))
    .catch((err) => logger.error("Connection error", err.stack));

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({error: "Unauthorized"});
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({error: "Forbidden"});
    }

    req.userId = user.userId;
    next();
  });
};

// Routes
app.post("/signup", async (req, res) => {
  console.log(req.body);

  const {firstName, lastName, email, password} = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({error: "All fields are required"});
  }

  try {
    const existingUserQuery = "SELECT * FROM users WHERE email = $1";
    const existingUserResult = await client.query(existingUserQuery, [email]);

    if (existingUserResult.rows.length > 0) {
      return res.status(409).json({error: "Email already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO users (first_name, last_name, email, password, admin) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;
    const insertValues = [firstName, lastName, email, hashedPassword, false];
    const result = await client.query(insertQuery, insertValues);
    const newUser = result.rows[0];

    const token = jwt.sign({
      userId: newUser.user_id,
      email: newUser.email,
      admin: newUser.admin,
    }, secretKey, {expiresIn: "1h"});

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
      token: token,
    });
  } catch (err) {
    console.error("Error creating user:", err.stack);
    res.status(500).json({error: "Error creating user"});
  }
});

app.post("/login", async (req, res) => {
  console.log(req.body);

  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({error: "Email and password are required"});
  }

  try {
    const userQuery = "SELECT * FROM users WHERE email = $1";
    const userResult = await client.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({error: "User not found"});
    }

    const user = userResult.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({error: "Invalid password"});
    }

    const token = jwt.sign({
      userId: user.user_id,
      email: user.email,
      admin: user.admin,
    }, secretKey, {expiresIn: "1h"});

    res.json({
      message: "Login successful",
      user: user,
      token: token,
    });
  } catch (err) {
    console.error("Error during login:", err.stack);
    res.status(500).json({error: "Error during login"});
  }
});

app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userQuery = "SELECT * FROM users WHERE user_id = $1";
    const userResult = await client.query(userQuery, [req.userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({error: "User not found"});
    }

    const user = userResult.rows[0];
    res.json({user: user});
  } catch (err) {
    console.error("Error fetching user data:", err.stack);
    res.status(500).json({error: "Error fetching user data"});
  }
});

app.get("/courses", authenticateToken, async (req, res) => {
  try {
    const coursesQuery = "SELECT * FROM courses";
    const coursesResult = await client.query(coursesQuery);
    const courses = coursesResult.rows;

    const enrolledCoursesQuery =
      "SELECT course_code FROM user_courses WHERE user_id = $1";
    const enrolledCoursesResult =
      await client.query(enrolledCoursesQuery, [req.userId]);
    const enrolledCourses =
      enrolledCoursesResult.rows.map((row) => row.course_code);

    const coursesWithEnrollment = courses.map((course) => ({
      ...course,
      enrolled: enrolledCourses.includes(course.course_code),
    }));

    res.json({courses: coursesWithEnrollment});
  } catch (err) {
    console.error("Error fetching courses:", err.stack);
    res.status(500).json({error: "Error fetching courses"});
  }
});

// Admin routes
app.get("/admin", authenticateToken, async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);

    if (decoded.admin === true) {
      const usersQuery = "SELECT * FROM users";
      const coursesQuery = "SELECT * FROM courses";

      const usersResult = await client.query(usersQuery);
      const coursesResult = await client.query(coursesQuery);

      res.json({
        users: usersResult.rows,
        courses: coursesResult.rows,
      });
    } else {
      res.status(403).json({
        error: "You are unauthorized and cannot access this page",
      });
    }
  } catch (err) {
    console.error("Error fetching admin data:", err.stack);
    res.status(500).json({error: "Error fetching admin data"});
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error ${err.message}`);
  res.status(500).json({error: "Internal Server Error"});
});

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);
