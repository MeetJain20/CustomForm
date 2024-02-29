const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const AdminModel = require("../models/AdminModel");
const EmployeeModel = require("../models/EmployeeModel");
const bcrypt = require("bcrypt");

const signupadm = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { empName, mobile, email, password, teamName } = req.body;
  let existingEmail;
  try {
    existingEmail = await AdminModel.findOne({ email: email });
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

  const createdUser = new AdminModel({
    empName: empName,
    mobile: mobile,
    email: email,
    password: password,
    teamName: teamName,
    role: "admin",
  });
  try {
    const newuser = await createdUser.save();

    const employeesToUpdate = await EmployeeModel.find({ teamName });
    employeesToUpdate.forEach(async (employee) => {
      employee.adminId.push(newuser._id);
      await employee.save();
    });
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


exports.signupadm = signupadm;
// exports.login = login;
