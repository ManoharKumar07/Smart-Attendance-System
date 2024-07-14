const express = require("express");
const app = express();
const router = require("./router/auth-router");
const connectDb = require("./utils/db");
require("dotenv").config();

app.get("/", (req, res) => {
  res.status(200).send("Welcome to thapa technical Mern Series Updated");
});

app.use("/api/auth/", router);

const PORT = 5000;
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running at port: ${PORT}`);
  });
});
