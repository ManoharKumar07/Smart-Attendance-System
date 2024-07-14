const Classroom = require("../models/classroom-model");

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
    // Handle potential errors
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

module.exports = { createclassroom, getclassroom };
