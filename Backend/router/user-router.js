const express = require("express");
const router = express.Router();
const usercontroller = require("../controllers/user-controller");

router.post("/createclassroom", usercontroller.createclassroom);
router.post("/getclassroom", usercontroller.getclassroom);
router.post("/getclass", usercontroller.getclass);
router.post("/createattendancereport", usercontroller.createattendancereport);
router.post("/getreportlength", usercontroller.getreportlength);
router.post("/updatereport", usercontroller.updatereport);
router.post("/getattendacereport", usercontroller.getattendacereport);
router.post("/getspecificreport", usercontroller.getspecificreport);

module.exports = router;
