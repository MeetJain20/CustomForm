const FormModel = require("../models/FormModel");
const EmployeeModel = require("../models/EmployeeModel");
const ResponseModel = require("../models/ResponseModel");

// GET Request

const getresponses = async (req, res, next) => {
  const { formid } = req.params;
  try {
    const responses = await ResponseModel.find({ formId: formid });
    if (!responses) {
      return res.status(404).json({ message: "Response not found" });
    }
    res.status(200).json(responses);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Failed to fetch assigned forms" });
  }
};

const getsubmittedforms = async (req, res, next) => {
  const { empid } = req.params;

  try {
    // Find all responses associated with the empId
    const responses = await ResponseModel.find({ employeeId: empid });

    if (!responses || responses.length === 0) {
      return res.status(404).json({ message: "No forms found" });
    }

    // Extract formIds from the responses
    const formIds = responses.map((response) => response.formId);

    // Find form details for each formId
    const formDetails = await FormModel.find({ _id: { $in: formIds } });

    if (!formDetails || formDetails.length === 0) {
      return res.status(404).json({ message: "Form details not found" });
    }

    // Send the aggregated form details
    res.status(200).json(formDetails);
  } catch (error) {
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
    if (!assignedForms || assignedForms.length === 0) {
      return res.status(404).json({ message: "No forms found" });
    }

    res.status(200).json(assignedForms);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch assigned forms" });
  }
};

const saveresponse = async (req, res, next) => {
  const { formId, employeeId, adminId, responses } = req.body;

  try {
   
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
    res.status(500).json({ message: "Failed to save response" });
  }
};

exports.getresponses = getresponses;
exports.getassignedforms = getassignedforms;
exports.getsubmittedforms = getsubmittedforms;
exports.saveresponse = saveresponse;

// exports.login = login;
