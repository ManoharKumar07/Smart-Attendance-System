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

// WHEN THE TAKE ATTENDANCE PAGE IS LOADED
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

//LENGTH IS USED TO TRACK THE NUMBER OF THE SESSION
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

//IT IS TO ATTENDANCE AS PRESENT WHEN STUDENT IS PREDICTED

const updatereport = async (req, res) => {
  const { classid, session, email } = req.body;

  try {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Find the attendance record first
    const attendanceRecord = await Attendance.findOne({
      classid,
      date: currentDate,
      session,
      "attendance.email": email,
    });

    if (!attendanceRecord) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Check if the status is already true
    const studentAttendance = attendanceRecord.attendance.find(
      (entry) => entry.email === email
    );

    if (studentAttendance.status === true) {
      return res.status(400).json({
        message: "Attendance already marked as present",
      });
    }

    // Update the attendance status
    const updatedAttendance = await Attendance.findOneAndUpdate(
      { classid, date: currentDate, session, "attendance.email": email },
      { $set: { "attendance.$.status": true } },
      { new: true }
    );

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

//TO MAP ALL ATTENDANCE REPORT WITH DATE AS TITLE IN VIEW ATTENDANCE PAGE
const getattendacereport = async (req, res) => {
  try {
    const { classid } = req.body;

    const report = await Attendance.find({
      classid,
    });

    res.status(201).json({
      message: "Attendance report fetched successfully",
      reports: report,
    });
  } catch (error) {
    res.status(500).json({
      message: "Can't find report",
      error: error.message,
    });
  }
};

// TO DISPLAY THE REPORT FOR THE SPECIFIC DATE WHEN USER CLICK ON VIEW BUTTON
const getspecificreport = async (req, res) => {
  const { classid, date } = req.body;

  try {
    // Find attendance records matching the classid and the specific date
    const attendanceRecords = await Attendance.find({ classid, date });

    if (attendanceRecords.length > 0) {
      res.status(200).json(attendanceRecords);
    } else {
      res.status(404).json({
        message: "No attendance records found for the given classid and date",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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
  getspecificreport,
};
