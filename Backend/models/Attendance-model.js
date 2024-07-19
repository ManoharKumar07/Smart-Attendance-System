const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AttendanceSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  classid: {
    type: String,
    required: true,
  },
  session: {
    type: String,
    required: true,
  },
  attendance: [
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },

      roll_number: {
        type: String,
        required: true,
      },
      status: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);

module.exports = Attendance;
