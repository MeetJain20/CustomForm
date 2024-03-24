const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const EmployeeModel = require("../models/EmployeeModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AdminModel = require("../models/AdminModel");

const getteamnames = async (req, res) => {
  const uniqueTeamNames = await AdminModel.distinct("teamName");

  // by using find()
  // const docs = await AdminModel.find({});
  // const uniqueTeamNames = [...new Set(docs.map(doc => doc.teamName))];

  if (uniqueTeamNames) {
    res.json(uniqueTeamNames);
  } else {
    res.json(null);
  }
};

const signupemp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Invalid inputs passed, please check your data.",
    });
  }
  const { empName, mobile, email, password, teamName } = req.body;

  const adminIds = await AdminModel.find({ teamName: teamName }).select("_id");

  let existingEmail;
  try {
    existingEmail = await EmployeeModel.findOne({ email: email });
  } catch (err) {
    return res.status(500).json({
      message: "Signing up failed, please try again later.",
    });
  }

  if (existingEmail) {
    return res.status(422).json({
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
  } catch (err) {
    return res.status(500).json({
      message: "Signing up failed, please try again later.",
    });
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password, role } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Invalid inputs passed, please check your data.",
    });
  }

  let existingUser;
  if (role === "admin") {
    try {
      existingUser = await AdminModel.findOne({ email: email });
    } catch (err) {
      return res.status(500).json({
        message: "Login failed, check your credentials or signup.",
      });

    }
  } else if (role === "employee") {
    try {
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
    } catch (err) {
      return res.status(500).json({
        message: "Logging in failed, please try again later.",
      });
    }
    res.json({ user: existingUser.toObject({ getters: true }), token: token });
  }
};

exports.signupemp = signupemp;
exports.getteamnames = getteamnames;
exports.login = login;

// exports.login = login;
