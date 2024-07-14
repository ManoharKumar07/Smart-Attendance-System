const express = require("express");
const router = express.Router();
const authcontroller = require("../controllers/auth-controller");

router.get("/register", authcontroller.register);

module.exports = router;
