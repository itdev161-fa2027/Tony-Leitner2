import express from "express";
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import connectDatabase from "./config/db.js";
import User from "./models/user.js";
import Post from "./models/Post.js";
import auth from "./middleware/auth.js";

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

app.get("/api/posts", async (request, response) => {
  try {
    const posts = await Post.find()
      .populate("user", "name")
      .sort({ createDate: -1 });

    response.json(posts);
  } catch (error) {
    console.error(error.message);
    response.status(500).send("Server error");
  }
});

app.get("/api/posts/:id", async (request, response) => {
  try {
    const post = await Post.findById(request.params.id).populate("user", "name");

    if (!post) {
      return response.status(404).json({ msg: "Post not found" });
    }

    response.json(post);
  } catch (error) {
    console.error(error.message);

    if (error.kind === "ObjectId") {
      return response.status(404).json({ msg: "Post not found" });
    }

    response.status(500).send("Server error");
  }
});

app.post(
  "/api/posts",
  [
    auth,
    check("title", "Title is required").notEmpty(),
    check("body", "Body is required").notEmpty()
  ],
  async (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, body } = request.body;
      const newPost = new Post({
        user: request.user.id,
        title,
        body
      });

      const post = await newPost.save();
      await post.populate("user", "name");
      response.json(post);
    } catch (error) {
      console.error(error.message);
      response.status(500).send("Server error");
    }
  }
);

app.put(
  "/api/posts/:id",
  [
    auth,
    check("title", "Title is required").notEmpty(),
    check("body", "Body is required").notEmpty()
  ],
  async (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, body } = request.body;
      const post = await Post.findById(request.params.id);

      if (!post) {
        return response.status(404).json({ msg: "Post not found" });
      }

      if (post.user.toString() !== request.user.id) {
        return response.status(401).json({ msg: "User not authorized" });
      }

      post.title = title;
      post.body = body;
      await post.save();
      await post.populate("user", "name");
      response.json(post);
    } catch (error) {
      console.error(error.message);

      if (error.kind === "ObjectId") {
        return response.status(404).json({ msg: "Post not found" });
      }

      response.status(500).send("Server error");
    }
  }
);

app.delete("/api/posts/:id", auth, async (request, response) => {
  try {
    const post = await Post.findById(request.params.id);

    if (!post) {
      return response.status(404).json({ msg: "Post not found" });
    }

    if (post.user.toString() !== request.user.id) {
      return response.status(401).json({ msg: "User not authorized" });
    }

    await Post.findByIdAndDelete(request.params.id);
    response.json({ msg: "Post removed" });
  } catch (error) {
    console.error(error.message);

    if (error.kind === "ObjectId") {
      return response.status(404).json({ msg: "Post not found" });
    }

    response.status(500).send("Server error");
  }
});

connectDatabase()
  .then(() => {
    console.log("Database connected successfully.");
    app.listen(3000, () => console.log("Server is running on port 3000"));
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exitCode = 1;
  });