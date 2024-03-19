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

const getresponses = async (req, res, next) => {
  const { formid } = req.params;
  try {
    const responses = await ResponseModel.find({ formId: formid });
    if (!responses) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json(responses);
  } catch (error) {
    console.error("Error fetching assigned forms:", error);
    res.status(500).json({ message: "Failed to fetch assigned forms" });
  }
};

const getsubmittedforms = async (req, res, next) => {
  const { empid } = req.params;

  try {
    // Find all responses associated with the empId
    const responses = await ResponseModel.find({ employeeId: empid });

    if (!responses || responses.length === 0) {
      return res.status(404).json({ message: "No submitted forms found" });
    }

    // Extract formIds from the responses
    const formIds = responses.map((response) => response.formId);

    // Find form details for each formId
    const formDetails = await FormModel.find({ _id: { $in: formIds } });

    if (!formDetails || formDetails.length === 0) {
      return res.status(404).json({ message: "Form details not found" });
    }

    // Send the aggregated form details
    res.json(formDetails);
  } catch (error) {
    console.error("Error fetching submitted forms:", error);
    res.status(500).json({ message: "Failed to fetch submitted forms" });
  }
};

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
  const { formId, employeeId, adminId, responses } = req.body;

  try {
    // Check if any object in the responses array has a FormData object in the response field
    const hasFormData = responses.some((response) => {
      return response.response instanceof FormData;
    });

    if (hasFormData) {
      // Handle the case where FormData is present in responses
      // This could mean that the client is attempting to send files
      console.log("Files are included in responses.");
      // You may want to handle this case differently, such as saving files separately
      return res.status(400).json({ message: "File upload not supported in responses" });
    }

    // If FormData is not present, proceed with saving the response
    // Retrieve the employee's name from EmployeeModel
    const employee = await EmployeeModel.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Extract the employee's name
    const empName = employee.empName; // Adjust this based on your EmployeeModel schema

    // Include the employee's name in the response data
    const newResponse = new ResponseModel({
      formId,
      employeeId,
      adminId,
      empName, // Include empName in the response
      responses,
    });
    await newResponse.save();

    res.status(201).json({ message: "Response saved successfully" });
  } catch (error) {
    console.error("Error saving response:", error);
    res.status(500).json({ message: "Failed to save response" });
  }
};

exports.getresponses = getresponses;
exports.getassignedforms = getassignedforms;
exports.getsubmittedforms = getsubmittedforms;
exports.saveresponse = saveresponse;

// exports.login = login;
