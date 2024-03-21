const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const FormModel = require("../models/FormModel");
const EmployeeModel = require("../models/EmployeeModel");

const nodemailer = require("nodemailer");
const ResponseModel = require("../models/ResponseModel");

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

const gettemplateforms = async (req, res, next) => {
  const templateForms = await FormModel.find({ isTemplate: true });

  if (templateForms) {
    res.json(templateForms);
  } else {
    return res.status(404).json({ message: "No forms found" });
  }
};

const getactiveforms = async (req, res, next) => {
  const { adminid } = req.params;

  const activeForms = await FormModel.find({
    adminId: adminid,
    isComplete: false,
  });

  if (activeForms) {
    res.json(activeForms);
  } else {
    return res.status(404).json({ message: "No forms found" });
  }
};

const getcompletedforms = async (req, res, next) => {
  const { adminid } = req.params;

  const completedForms = await FormModel.find({
    adminId: adminid,
    isComplete: true,
  });

  if (completedForms) {
    res.json(completedForms);
  } else {
    return res.status(404).json({ message: "No forms found" });
  }
};

// POST Request

const getcurrentform = async (req, res, next) => {
  const { formid } = req.body;
  const currentForm = await FormModel.find({ _id: formid });

  if (currentForm) {
    res.json(currentForm);
  } else {
    res.json(null);
  }
};

const copyfield = async (req, res, next) => {
  try {
    const { formid, fielddata } = req.body;
    const form = await FormModel.findById(formid);

    // Push the new field data to the form fields array
    form.fields.push(fielddata);

    // Save the updated form
    const updatedForm = await form.save();

    if (!updatedForm) {
      throw new HttpError("Form not found", 404);
    }
    res.json(updatedForm);
  } catch (error) {
    console.error("Error copying form field:", error);
    const statusCode = error.statusCode || 500;
    const message = error.message || "Failed to copy form field";
    res.status(statusCode).json({ message });
  }
};

const createforms = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { adminId } = req.body;
  const formData = new FormModel({
    adminId: adminId,
    formtitle: "Form Title",
    formdesc: "Form Description",
    fields: [],
    isComplete: false,
    isTemplate: false,
  });
  try {
    const newform = await formData.save();
    // console.log(newuser,'no new user error')
  } catch (err) {
    console.log("saving error");
    const error = new HttpError("Form Creation Failed", 500);
    return next(error);
  }
  res.json({ form: formData.toObject({ getters: true }) });
};

const createFromTemplate = async (req, res, next) => {
  const { formid, adminId } = req.body;

  try {
    // Find the template form by ID
    const templateForm = await FormModel.findById(formid);

    if (!templateForm) {
      throw new HttpError("Template form not found", 404);
    }

    // Create a new form using template form data
    const newForm = new FormModel({
      adminId: adminId,
      formtitle: templateForm.formtitle,
      formdesc: templateForm.formdesc,
      fields: templateForm.fields,
      isComplete: false,
      isTemplate: false,
    });

    // Save the new form
    const savedForm = await newForm.save();

    if (!savedForm) {
      throw new HttpError("Failed to create form from template", 500);
    }

    res.status(201).json(savedForm);
  } catch (error) {
    console.error("Error creating form from template:", error);
    const statusCode = error.statusCode || 500;
    const message = error.message || "Failed to create form from template";
    res.status(statusCode).json({ message });
  }
};

exports.createFromTemplate = createFromTemplate;

// PUT Request

const updateformstatus = async (req, res, next) => {
  try {
    const { formid } = req.body;

    // Get the adminId from the FormModel
    const form = await FormModel.findById(formid);
    if (!form) {
      throw new HttpError("Form not found", 404);
    }
    const adminId = form.adminId;

    // Find all employees with the adminId in their adminId array
    const employees = await EmployeeModel.find({ adminId });
    // Extract email addresses from the employees
    const recipients = employees.map((employee) => employee.email);
    // Send email to all recipients
    if (recipients.length > 0) {
      sendMail(recipients);
    }
    // Update form status
    const formstatus = await FormModel.findByIdAndUpdate(
      formid,
      { isComplete: true },
      { new: true }
    );

    res.json(formstatus);
  } catch (error) {
    console.error("Error Saving form : ", error);
    const statusCode = error.statusCode || 500;
    const message = error.message || "Failed to Save the form";
    res.status(statusCode).json({ message });
  }
};

const updateeditstatus = async (req, res, next) => {
  try {
    const { formid } = req.body;

    // Update the edit status of the form
    const editstatus = await FormModel.findByIdAndUpdate(
      formid,
      { isComplete: false },
      { new: true }
    );

    if (!editstatus) {
      throw new HttpError("Form not found", 404);
    }

    // Delete all responses for the corresponding formid
    await ResponseModel.deleteMany({ formId: formid });

    res.json(editstatus);
  } catch (error) {
    console.error("Error Making it Editable: ", error);
    const statusCode = error.statusCode || 500;
    const message = error.message || "Failed to make the form Editable";
    res.status(statusCode).json({ message });
  }
};

const updatetemplatestatus = async (req, res, next) => {
  try {
    const { formid } = req.body;
    const formstatus = await FormModel.findByIdAndUpdate(
      formid,
      { isTemplate: true },
      { new: true }
    );
    if (!formstatus) {
      throw new HttpError("Form not found", 404);
    }
    res.json(formstatus);
  } catch (error) {
    console.error("Error Saving form as Template: ", error);
    const statusCode = error.statusCode || 500;
    const message = error.message || "Failed to Save the form as Template";
    res.status(statusCode).json({ message });
  }
};

const updateformtitle = async (req, res, next) => {
  try {
    const { formid, formtitle } = req.body;
    const updatetitle = await FormModel.findByIdAndUpdate(
      formid,
      { formtitle },
      { new: true }
    );
    if (!updatetitle) {
      throw new HttpError("Form not found", 404);
    }
    res.json(updatetitle);
  } catch (error) {
    console.error("Error updating form title:", error);
    const statusCode = error.statusCode || 500;
    const message = error.message || "Failed to update form title";
    res.status(statusCode).json({ message });
  }
};

const updateformdesc = async (req, res, next) => {
  try {
    const { formid, formdesc } = req.body;
    const updatedesc = await FormModel.findByIdAndUpdate(
      formid,
      { formdesc },
      { new: true }
    );
    if (!updatedesc) {
      throw new HttpError("Form not found", 404);
    }
    res.json(updatedesc);
  } catch (error) {
    console.error("Error updating form description:", error);
    const statusCode = error.statusCode || 500;
    const message = error.message || "Failed to update form description";
    res.status(statusCode).json({ message });
  }
};

const updateformfields = async (req, res, next) => {
  try {
    const { formid, fielddata } = req.body;
    const form = await FormModel.findById(formid);

    // Check if field with the same fieldId exists
    const existingFieldIndex = form.fields.findIndex(
      (field) => field.fieldid === fielddata.fieldid
    );
    if (existingFieldIndex !== -1) {
      // Update the existing field
      form.fields[existingFieldIndex] = fielddata;
    } else {
      // Push the new field
      form.fields.push(fielddata);
    }

    // Save the updated form
    const updatedForm = await form.save();

    if (!updatedForm) {
      throw new HttpError("Form not found", 404);
    }
    res.json(updatedForm);
  } catch (error) {
    console.error("Error updating form fields:", error);
    const statusCode = error.statusCode || 500;
    const message = error.message || "Failed to update form fields";
    res.status(statusCode).json({ message });
  }
};

const addnewfield = async (req, res, next) => {
  const { formid, newFieldData } = req.body;
  try {
    const form = await FormModel.findById(formid);

    // Push the new field data
    form.fields.push(newFieldData);

    // Save the updated form
    const updatedForm = await form.save();

    if (!updatedForm) {
      throw new HttpError("Form not found", 404);
    }

    res.json(updatedForm);
  } catch (error) {
    console.error("Error updating form fields:", error);
    const statusCode = error.statusCode || 500;
    const message = error.message || "Failed to update form fields";
    res.status(statusCode).json({ message });
  }
};

// DELETE Request

const deletefield = async (req, res, next) => {
  const { formid, fieldid } = req.body;

  try {
    const form = await FormModel.findById(formid);

    // Find the index of the field with the specified fieldid
    const fieldIndex = form.fields.findIndex(
      (field) => field.fieldid === fieldid
    );

    if (fieldIndex === -1) {
      // Field not found
      return res.status(404).send("Field not found");
    }

    // Remove the field from the fields array
    form.fields.splice(fieldIndex, 1);

    // Save the updated form
    const updatedForm = await form.save();

    if (!updatedForm) {
      throw new HttpError("Form not found", 404);
    }
    res.json(updatedForm);
  } catch (error) {
    console.error("Error deleting form field:", error);
    const statusCode = error.statusCode || 500;
    const message = error.message || "Failed to delete form field";
    res.status(statusCode).json({ message });
  }
};

const deleteform = async (req, res, next) => {
  const { formid } = req.body;

  try {
    // Step 1: Delete the form by its ID
    const deletedForm = await FormModel.findByIdAndDelete(formid);

    if (!deletedForm) {
      return res.status(404).send("Form not found");
    }

    // Step 2: Check if the form is complete
    if (deletedForm.isComplete) {
      // Step 3: Delete associated documents in the ResponseModel
      await ResponseModel.deleteMany({ formId: formid });
    }

    res.json({ deletedForm });
  } catch (error) {
    console.error("Error deleting form:", error);
    const statusCode = error.statusCode || 500;
    const message = error.message || "Failed to delete form";
    res.status(statusCode).json({ message });
  }
};

exports.getactiveforms = getactiveforms;
exports.getcompletedforms = getcompletedforms;
exports.gettemplateforms = gettemplateforms;
exports.getcurrentform = getcurrentform;
exports.createforms = createforms;
exports.createFromTemplate = createFromTemplate;
exports.copyfield = copyfield;
exports.updateformtitle = updateformtitle;
exports.updateformdesc = updateformdesc;
exports.updateformstatus = updateformstatus;
exports.updateeditstatus = updateeditstatus;
exports.updatetemplatestatus = updatetemplatestatus;
exports.updateformfields = updateformfields;
exports.addnewfield = addnewfield;
exports.deletefield = deletefield;
exports.deleteform = deleteform;

// exports.login = login;
