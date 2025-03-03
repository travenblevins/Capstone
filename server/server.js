// server/server.js

const express = require("express");
const app = express();
const path = require("path");
const { Client } = require("pg"); // Import the pg module
require("dotenv").config(); // Load environment variables from .env file
const cors = require("cors");
// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/dist")));


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

app.get("/api", async (req, res) => {
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

app.get("/api/hello", (req, res) => {
  res.send('Hello, World!');
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});