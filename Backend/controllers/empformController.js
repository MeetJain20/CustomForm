const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const FormModel = require("../models/FormModel");
const EmployeeModel = require("../models/EmployeeModel");
const ResponseModel = require("../models/ResponseModel");

const nodemailer = require("nodemailer");

const sendMail = async (recipients) => {
  try {
    let config = {
      service: "gmail",
      auth: {
        user: process.env.SENDER_MAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    };

    const transporter = nodemailer.createTransport(config);

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Form Assigned</title>
      </head>
      <body>
        <div style="background-color: #f0f0f0; padding: 20px;">
          <h2 style="color: #333;">Please fill this form as soon as possible</h2>
          <p style="color: #666;">Best regards,<br>Darwinbox Team</p>
        </div>
      </body>
      </html>
    `;

    let message = {
      from: process.env.SENDER_MAIL,
      to: recipients.join(", "),
      subject: "DARWINBOX Forms Team",
      html: htmlContent,
    };

    const info = await transporter.sendMail(message);

    return "Mail sent successfully";
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};

// GET Request

const getassignedforms = async (req, res, next) => {
  const { empid } = req.params;
  try {
    const emp = await EmployeeModel.findById(empid);
    if (!emp) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const adminIds = emp.adminId;

    // Find forms that are complete and not responded by the employee
    const assignedForms = await FormModel.find({
      adminId: { $in: adminIds },
      isComplete: true,
      _id: {
        $nin: await ResponseModel.distinct("formId", { employeeId: empid }),
      }, // Exclude forms with formId present in the ResponseModel for the given empId
    });

    res.json(assignedForms);
  } catch (error) {
    console.error("Error fetching assigned forms:", error);
    res.status(500).json({ message: "Failed to fetch assigned forms" });
  }
};

const saveresponse = async (req, res, next) => {
  const { formId, employeeId, adminId, responses } = req.body; // Assuming the data is sent in the request body

  try {
    const newResponse = new ResponseModel({
      formId,
      employeeId,
      adminId,
      responses,
    });
    await newResponse.save();

    res.status(201).json({ message: "Response saved successfully" });
  } catch (error) {
    console.error("Error saving response:", error);
    res.status(500).json({ message: "Failed to save response" });
  }
};

exports.getassignedforms = getassignedforms;
exports.saveresponse = saveresponse;

// exports.login = login;
