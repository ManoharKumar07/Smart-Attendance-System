const express = require("express");
const router = express.Router();
const studentcontroller = require("../controllers/student-controller");

router.post("/getstudents", studentcontroller.getstudents);
router.post("/addstudent", studentcontroller.addstudent);

module.exports = router;
