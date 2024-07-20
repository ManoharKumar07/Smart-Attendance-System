const Classroom = require("../models/classroom-model");
const Attendance = require("../models/Attendance-model");

const createclassroom = async (req, res) => {
  const { classname, department, subject, createdBy } = req.body;

  if (!classname || !department || !subject || !createdBy) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create a new classroom document
    const newClassroom = new Classroom({
      classname,
      department,
      subject,
      createdBy,
    });

    // Save the document to the database
    await newClassroom.save();

    // Send a success response
    res.status(201).json({
      message: "Classroom created successfully",
      classroom: newClassroom,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create classroom", error: error.message });
  }
};

const getclassroom = async (req, res) => {
  const { email } = req.body;

  try {
    // Find classrooms created by the user with the provided email
    const classrooms = await Classroom.find({ createdBy: email });

    res.status(200).json({
      message: "Classrooms fetched successfully",
      classrooms: classrooms,
    });
  } catch (error) {
    // Handle potential errors
    res.status(500).json({
      message: "Failed to fetch classrooms",
      error: error.message,
    });
  }
};

const getclass = async (req, res) => {
  const { id } = req.body;

  try {
    // Find the classroom by ID
    const classroom = await Classroom.findById(id);

    if (!classroom) {
      return res.status(404).json({
        message: "Classroom not found",
      });
    }

    res.status(200).json({
      message: "Classroom fetched successfully",
      classroom: classroom,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to fetch classroom",
      error: error.message,
    });
  }
};

const createattendancereport = async (req, res) => {
  try {
    const { classid, attendance, session } = req.body;

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const updatedAttendance = await Attendance.findOneAndUpdate(
      { classid, date: currentDate, session },
      {
        $addToSet: { attendance: { $each: attendance } },
        $setOnInsert: { date: currentDate, classid, session },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({
      message: "Attendance report created/updated successfully",
      data: updatedAttendance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating/updating attendance report",
      error: error.message,
    });
  }
};

const getreportlength = async (req, res) => {
  try {
    const { classid } = req.body;

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const report = await Attendance.find({
      classid,
      date: { $gte: currentDate },
    });

    res.status(201).json({
      message: "Attendance report length fetched successfully",
      reports: report,
    });
  } catch (error) {
    res.status(500).json({
      message: "Can't find length",
      error: error.message,
    });
  }
};

const updatereport = async (req, res) => {
  try {
    const { classid, session, email } = req.body;

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const updatedAttendance = await Attendance.findOneAndUpdate(
      { classid, date: currentDate, session, "attendance.email": email },
      { $set: { "attendance.$.status": true } },
      { new: true }
    );

    if (!updatedAttendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    res.status(200).json({
      message: "Attendance status updated successfully",
      data: updatedAttendance,
    });
  } catch (error) {
    console.error("Error updating attendance status", error);
    res.status(500).json({
      message: "Error updating attendance status",
      error: error.message,
    });
  }
};
const getattendacereport = async (req, res) => {
  try {
    const { classid } = req.body;

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const report = await Attendance.find({
      classid,
      date: { $gte: currentDate },
    });

    res.status(201).json({
      message: "Attendance report length fetched successfully",
      reports: report,
    });
  } catch (error) {
    res.status(500).json({
      message: "Can't find length",
      error: error.message,
    });
  }
};

module.exports = {
  createclassroom,
  getclassroom,
  getclass,
  createattendancereport,
  getreportlength,
  updatereport,
  getattendacereport,
};
