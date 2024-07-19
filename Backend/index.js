const express = require("express");
const app = express();
const router = require("./router/auth-router");
const userrouter = require("./router/user-router");
const studentrouter = require("./router/student-router");
const connectDb = require("./utils/db");
require("dotenv").config();
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.use("/api/auth/", router);
app.use("/api/user/", userrouter);
app.use("/api/user/student", studentrouter);

const PORT = 5000;
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running at port: ${PORT}`);
  });
});
