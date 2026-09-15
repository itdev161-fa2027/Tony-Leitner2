import express from "express";
import { check, validationResult } from "express-validator";
import connectDatabase from "./config/db.js";

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

app.get("/", (request, response) => {
  response.send("HTTP GET request sent to root API endpoint.");
});

// User registration endpoint
app.post(
  "/api/users",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be password123").equals("password123")
  ],
  (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    response.json(request.body);
  }
);

connectDatabase()
  .then(() => {
    console.log("Database connected successfully.");
    app.listen(3000, () => console.log("Server is running on port 3000"));
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exitCode = 1;
  });