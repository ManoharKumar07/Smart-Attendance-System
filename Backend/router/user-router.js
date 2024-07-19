const express = require("express");
const router = express.Router();
const usercontroller = require("../controllers/user-controller");

router.post("/createclassroom", usercontroller.createclassroom);
router.post("/getclassroom", usercontroller.getclassroom);
router.post("/getclass", usercontroller.getclass);
router.post("/createattendancereport", usercontroller.createattendancereport);

module.exports = router;
