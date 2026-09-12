import express from "express";
import connectDatabase from "./config/db.js";

const app = express();


app.get("/", (request, response) => {
  response.send("http get rrequest sent to root api endpoint.");
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
