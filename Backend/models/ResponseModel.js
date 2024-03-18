const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const responseSchema = new Schema({
  formId: { type: mongoose.Types.ObjectId, required: true },
  employeeId: { type: mongoose.Types.ObjectId, required: true },
  adminId: { type: mongoose.Types.ObjectId, required: true },
  responses: [{ type: Object, required: true }],
});

module.exports = mongoose.model("ResponseModel", responseSchema);
