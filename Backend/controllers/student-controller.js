const Student = require("../models/student-model");

// Controller to add a student  CLASSROOM DETAIL PAGE TAB
const addstudent = async (req, res) => {
  const { name, email, classid, roll_number } = req.body;

  if (!name || !email || !classid || !roll_number) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      return res
        .status(400)
        .json({ message: "Student with this email already exists." });
    }

    const newStudent = new Student({
      name,
      email,
      classid,
      roll_number,
    });

    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const getstudents = async (req, res) => {
  const { classid } = req.body;

  try {
    const students = await Student.find({ classid });
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const getstudentenr = async (req, res) => {
  const { classid } = req.body;

  try {
    const students = await Student.find({ classid }).select(
      "email name roll_number"
    );
    res.status(200).json({ data: students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = { getstudents, addstudent, getstudentenr };
