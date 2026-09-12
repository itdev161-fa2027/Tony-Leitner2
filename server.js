const express = require("express");

const app = express();
const port = 3000;

app.get("/", (request, response) => {
  response.send("http get rrequest sent to root api endpoint.");
});

app.listen(3000, () => console.log(`Server is running on port 3000`));
