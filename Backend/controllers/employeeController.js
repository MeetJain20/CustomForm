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
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { empName, mobile, email, password, teamName } = req.body;

  const adminIds = await AdminModel.find({ teamName: teamName }).select("_id");

  let existingEmail;
  try {
    existingEmail = await EmployeeModel.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingEmail) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
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
  // console.log(createdUser)
  try {
    const newuser = await createdUser.save();
    // console.log(newuser,'no new user error')
  } catch (err) {
    console.log("saving error");
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password, role } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  let existingUser;
  if (role === "admin") {
    try {
      existingUser = await AdminModel.findOne({ email: email });
    } catch (err) {
      const error = new HttpError(
        "Login failed, check your credentials or signup.",
        500
      );
      return next(error);
    }
  } else if (role === "employee") {
    try {
      existingUser = await EmployeeModel.findOne({ email: email });
    } catch (err) {
      const error = new HttpError(
        "Login failed, check your credentials or signup.",
        500
      );
      return next(error);
    }
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    res.json(null);

    return next(error);
  } else {
    const pass = await bcrypt.compare(password, existingUser.password);
    if (role !== existingUser.role) {
      const error = new HttpError(
        "Invalid role as per entered while registering",
        401
      );
      res.json(null);
      return next(error);
    }
    if (!pass) {
      const error = new HttpError(
        "Invalid credentials, could not log you in.",
        401
      );
      res.json(null);
      return next(error);
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
      // lo;
    } catch (err) {
      const error = new HttpError(
        "Logging in failed, please try again later.",
        500
      );
      return next(error);
    }
    // console.log(existingUser.id + " " + "possible?");

    res.json({ user: existingUser.toObject({ getters: true }), token: token });
  }
};

exports.signupemp = signupemp;
exports.getteamnames = getteamnames;
exports.login = login;

// exports.login = login;
