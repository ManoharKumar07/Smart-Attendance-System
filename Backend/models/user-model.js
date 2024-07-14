const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
});

// define the model or the collection name
const User = new mongoose.model("USER", userSchema);
module.exports = User;
