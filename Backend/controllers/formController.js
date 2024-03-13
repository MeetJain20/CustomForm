const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const FormModel = require("../models/FormModel");

const getcurrentform = async (req, res, next) => {
  const { formid } = req.body;
  const currentForm = await FormModel.find({ _id: formid });

  if (currentForm) {
    res.json(currentForm);
  } else {
    res.json(null);
  }
};

const getactiveforms = async (req, res, next) => {
  const activeForms = await FormModel.find({ isComplete: false });

  if (activeForms) {
    res.json(activeForms);
  } else {
    res.json(null);
  }
};
const getcompletedforms = async (req, res, next) => {
  const completedForms = await FormModel.find({ isComplete: true });

  if (completedForms) {
    res.json(completedForms);
  } else {
    res.json(null);
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
    formtitle: "Untitled Form",
    formdesc: "Description Here",
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


const updateformstatus = async (req, res, next) => {
  try {
    const { formid } = req.body;
    const formstatus = await FormModel.findByIdAndUpdate(
      formid,
      { isComplete: true },
      { new: true }
    );
    if (!formstatus) {
      throw new HttpError("Form not found", 404);
    }
    res.json(formstatus);
  } catch (error) {
    console.error("Error Saving form : ", error);
    const statusCode = error.statusCode || 500;
    const message = error.message || "Failed to Save the form";
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

exports.getactiveforms = getactiveforms;
exports.getcurrentform = getcurrentform;
exports.getcompletedforms = getcompletedforms;
exports.updateformtitle = updateformtitle;
exports.updateformdesc = updateformdesc;
exports.updateformstatus = updateformstatus;
exports.updateformfields = updateformfields;
exports.copyfield = copyfield;
exports.deletefield = deletefield;
exports.createforms = createforms;
// exports.login = login;
