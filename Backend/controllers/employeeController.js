const EmployeeModel = require("../models/EmployeeModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AdminModel = require("../models/AdminModel");

const getteamnames = async (req, res) => {
  try {
    const uniqueTeamNames = await AdminModel.distinct("teamName");
    if (uniqueTeamNames) {
      res.status(200).json(uniqueTeamNames);
    } else {
      res.status(200).json(null);
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching existing teams" });
  }
};

// Signup

const signupemp = async (req, res, next) => {
  const { empName, mobile, email, password, teamName } = req.body;
  let adminIds;
  try {
    adminIds = await AdminModel.find({ teamName: teamName }).select("_id");
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching adminIds, please try again later.",
    });
  }
  let existingEmail;
  try {
    existingEmail = await EmployeeModel.findOne({ email: email });
  } catch (err) {
    return res.status(500).json({
      message: "Error while searching for existing Emails.",
    });
  }

  if (existingEmail) {
    return res.status(409).json({
      message: "User exists already, please login instead.",
    });
  }

  const createdUser = new EmployeeModel({
    empName: empName,
    mobile: mobile,
    email: email,
    password: password,
    teamName: teamName,
    role: "employee",
    adminId: adminIds,
  });
  try {
    const newuser = await createdUser.save();
    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
  } catch (err) {
    return res.status(500).json({
      message: "Error saving details, please try again later.",
    });
  }
};

// Login

const login = async (req, res, next) => {
  const { email, password, role } = req.body;

  let existingUser;
  if (role === "admin") {
    try {
      existingUser = await AdminModel.findOne({ email: email });
    } catch (err) {
      return res.status(500).json({
        message: "Login failed, check your credentials or signup.",
      });
    }
  } 
  else {
    try {
      // console.log("Hereeeeeeeeeeeeeeeeeeeeee");
      existingUser = await EmployeeModel.findOne({ email: email });
    } catch (err) {
      return res.status(500).json({
        message: "Login failed, check your credentials or signup.",
      });
    }
  }

  if (!existingUser) {
    return res.status(401).json({
      message: "Invalid credentials, could not log you in.",
    });
  } else {
    const pass = await bcrypt.compare(password, existingUser.password);
    if (role !== existingUser.role) {
      return res.status(401).json({
        message: "Invalid role as per entered while registering.",
      });
    }
    if (!pass) {
      return res.status(401).json({
        message: "Invalid password, could not log you in.",
      });
    }
    delete existingUser.password;
    let token;
    try {
      token = jwt.sign(
        {
          userId: existingUser._id,
          email: existingUser.email,
          role: existingUser.role,
        },
        process.env.SUPERSECRET_KEY,
        { expiresIn: "1d" }
      );
      return res
        .status(200)
        .json({ id: existingUser._id, token: token });
    } catch (err) {
      return res.status(500).json({
        message: "Error while signing JWT Token.",
      });
    }
  }
};

exports.signupemp = signupemp;
exports.getteamnames = getteamnames;
exports.login = login;

// exports.login = login;
