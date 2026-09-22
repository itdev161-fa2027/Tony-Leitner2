import express from "express";
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import connectDatabase from "./config/db.js";
import User from "./models/user.js";

dotenv.config();

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

app.get("/", (request, response) => {
  response.send("HTTP GET request sent to root API endpoint.");
});

app.post(
  "/api/users",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 })
  ],
  async (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = request.body;

    try {
      const normalizedEmail = email.toLowerCase();
      const existingUser = await User.findOne({ email: normalizedEmail });

      if (existingUser) {
        return response.status(400).json({
          errors: [{ msg: "User with this email already exists" }]
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword
      });

      const token = jwt.sign(
        { user: { id: user.id } },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      response.json({ msg: "User registered successfully", token });
    } catch (error) {
      console.error(error.message);
      response.status(500).send("Server error");
    }
  }
);

app.post(
  "/api/auth",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    const { email, password } = request.body;

    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      const isMatch = user && await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return response.status(400).json({
          errors: [{ msg: "Invalid credentials" }]
        });
      }

      const token = jwt.sign(
        { user: { id: user.id } },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      response.json({ msg: "User logged in successfully", token });
    } catch (error) {
      console.error(error.message);
      response.status(500).send("Server error");
    }
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