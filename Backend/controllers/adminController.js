const { validationResult } = require("express-validator");
const AdminModel = require("../models/AdminModel");
const EmployeeModel = require("../models/EmployeeModel");

const signupadm = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Invalid inputs passed, please check your data.",
    });
  }
  
  const { empName, mobile, email, password, teamName } = req.body;
  let existingEmail;
  try {
    existingEmail = await AdminModel.findOne({ email: email });
  } catch (err) {
    return res.status(500).json({
      message: "Signing up failed, please try again later.",
    });
  }
  
  if (existingEmail) {
    return res.status(409).json({
      message: "User exists already, please login instead.",
    });
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
    
    return res.status(201).json({ user: createdUser.toObject({ getters: true }) });
  } catch (err) {
    return res.status(500).json({
      message: "Signing up failed, please try again later.",
    });
  }
};


exports.signupadm = signupadm;
// exports.login = login;
