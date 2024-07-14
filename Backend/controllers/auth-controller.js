const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// **************Registration********************************************************
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const saltRounds = 10;
    const hash_password = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      username,
      email,
      password: hash_password,
    });

    res.status(201).json({
      message: "Register Successful",
      success: "true",
      //generating token if we get correct usename and password
      token: await jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
      }),
      userId: user._id.toString(),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// **************Registration  End********************************************************

// **************Login Logic ********************************************************
const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    }
    //comparing the user entered password with the real password through the user which we got above
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res
        .status(200)
        .send({ message: "Invlid EMail or Password", success: false });
    }

    if (isPasswordValid) {
      res.status(200).json({
        message: "Login Successful",
        success: "true",
        username: user.username,
        email: user.email,
        //generating token if we get correct usename and password
        token: await jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
          expiresIn: "1d",
        }),
        userId: user._id.toString(),
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};

// **************Login logic End********************************************************
module.exports = { register, login };
