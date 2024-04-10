const { validationResult } = require("express-validator");
const FormModel = require("../models/FormModel");
const EmployeeModel = require("../models/EmployeeModel");

const nodemailer = require("nodemailer");
const ResponseModel = require("../models/ResponseModel");

const sendMail = async (recipients,formid) => {
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
          <p style="color: #666;">Click <a href="https://form-forge.netlify.app/displayform/${formid}">here</a> to fill the form.</p>
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

  } catch (error) {
    // console.log(error);
  }
};

// GET Request

const gettemplateforms = async (req, res, next) => {
  try {
    const templateForms = await FormModel.find({ isTemplate: true });

    if (templateForms) {
      res.status(200).json(templateForms);
    } else {
      return res.status(404).json({ message: "No forms found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error fetching forms" });
  }
};

const getactiveforms = async (req, res, next) => {
  const { adminid } = req.params;
  try {
    const activeForms = await FormModel.find({
      adminId: adminid,
      isComplete: false,
    });

    if (activeForms) {
      res.status(200).json(activeForms);
    } else {
      return res.status(404).json({ message: "No forms found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error fetching forms" });
  }
};

const getcompletedforms = async (req, res, next) => {
  const { adminid } = req.params;
  try {
    const completedForms = await FormModel.find({
      adminId: adminid,
      isComplete: true,
    });

    if (completedForms) {
      res.status(200).json(completedForms);
    } else {
      return res.status(404).json({ message: "No forms found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error fetching forms" });
  }
};

const getcurrentform = async (req, res, next) => {
  const { formid } = req.params;
  try {
    const currentForm = await FormModel.find({ _id: formid });

    if (currentForm) {
      return res.status(200).json(currentForm);
    } else {
      return res.status(404).json({ message: "No forms found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error fetching forms" });
  }
};

// POST Request

const copyfield = async (req, res, next) => {
  try {
    const { formid, fielddata } = req.body;
    const form = await FormModel.findById(formid);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    // Push the new field data to the form fields array
    form.fields.push(fielddata);

    // Save the updated form
    const updatedForm = await form.save();

    if (updatedForm) {
      return res.status(200).json(updatedForm);
    } else {
      return res.status(404).json({ message: "Form not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to copy form field" });
  }
};

const createforms = async (req, res, next) => {
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
    res.status(200).json({ id: newform._id });
  } catch (err) {
    return res.status(500).json({ message: "Form Creation Failed" });
  }
};

const createFromTemplate = async (req, res, next) => {
  const { formid, adminId } = req.body;

  try {
    // Find the template form by ID
    const templateForm = await FormModel.findById(formid);

    if (!templateForm) {
      return res.status(404).json({ message: "Template form not found" });
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
      return res
        .status(500)
        .json({ message: "Error while saving the form to database" });
    }

    res.status(201).json(savedForm);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create form from template" });
  }
};

// PUT Request

const updateformstatus = async (req, res, next) => {
  try {
    const { formid } = req.body;

    const form = await FormModel.findById(formid);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    const adminId = form.adminId;

    const employees = await EmployeeModel.find({ adminId });
    const recipients = employees.map((employee) => employee.email);
    if (recipients.length > 0) {
      sendMail(recipients,formid);
      const formstatus = await FormModel.findByIdAndUpdate(
        formid,
        { isComplete: true },
        { new: true }
      );

      return res.status(200).json(formstatus);
    } else {
      const formstatus = await FormModel.findByIdAndUpdate(
        formid,
        { isComplete: true },
        { new: true }
      );

      return res.status(200).json(formstatus);
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to Save the form" });
  }
};

const updateeditstatus = async (req, res, next) => {
  try {
    const { formid } = req.body;

    // Update the edit status of the form
    const editstatus = await FormModel.findByIdAndUpdate(
      formid,
      { isComplete: false, isTemplate: false },
      { new: true }
    );

    if (!editstatus) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Delete all responses for the corresponding formid
    await ResponseModel.deleteMany({ formId: formid });

    res.status(200).json(editstatus);
  } catch (error) {
    res.status(500).json({ message: "Failed to make the form Editable" });
  }
};

const updatetemplatestatus = async (req, res, next) => {
  try {
    const { formid } = req.body;
    const formstatus = await FormModel.findByIdAndUpdate(
      formid,
      { isTemplate: true, isComplete: true },
      { new: true }
    );
    if (!formstatus) {
      return res.status(404).json({ message: "Form not found" });
    }
    return res.status(200).json(formstatus);
  } catch (error) {
    res.status(500).json({ message: "Failed to Save the form as Template" });
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
      return res.status(404).json({ message: "Form not found" });
    }
    res.status(200).json(updatetitle);
  } catch (error) {
    res.status(500).json({ message: "Failed to update form title" });
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
      return res.status(404).json({ message: "Form not found" });
    }
    res.status(200).json(updatedesc);
  } catch (error) {
    res.status(500).json({ message: "Failed to update form description" });
  }
};

const updateformfields = async (req, res, next) => {
  try {
    const { formid, fielddata } = req.body;
    const form = await FormModel.findById(formid);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
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
      return res.status(404).json({ message: "Form not found" });
    }
    return res.status(200).json(updatedForm);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update form fields" });
  }
};

const addnewfield = async (req, res, next) => {
  const { formid, newFieldData } = req.body;
  try {
    const form = await FormModel.findById(formid);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    // Push the new field data
    form.fields.push(newFieldData);

    // Save the updated form
    const updatedForm = await form.save();

    if (!updatedForm) {
      return res.status(404).json({ message: "Form not found" });
    } else {
      return res.status(200).json(updatedForm);
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to add new field" });
  }
};

// DELETE Request

const deletefield = async (req, res, next) => {
  const { formid, fieldid } = req.body;

  try {
    const form = await FormModel.findById(formid);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    // Find the index of the field with the specified fieldid
    const fieldIndex = form.fields.findIndex(
      (field) => field.fieldid === fieldid
    );
    if (fieldIndex === -1) {
      // Field not found
      return res.status(404).json({ message: "Field not found" });
    }

    // Remove the field from the fields array
    form.fields.splice(fieldIndex, 1);

    // Save the updated form
    const updatedForm = await form.save();

    return res.status(200).json(updatedForm);
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete form field" });
  }
};

const deleteform = async (req, res, next) => {
  const { formid } = req.body;

  try {
    // Step 1: Delete the form by its ID
    const deletedForm = await FormModel.findByIdAndDelete(formid);

    if (!deletedForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Step 2: Check if the form is complete
    if (deletedForm.isComplete) {
      // Step 3: Delete associated documents in the ResponseModel
      await ResponseModel.deleteMany({ formId: formid });
      return res.status(200).json({ deletedForm });
    } else {
      return res.status(200).json({ deletedForm });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete form" });
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
