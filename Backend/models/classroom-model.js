const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Classroom schema
const ClassroomSchema = new Schema({
  classname: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Classroom model
const Classroom = mongoose.model("Classroom", ClassroomSchema);

module.exports = Classroom;
