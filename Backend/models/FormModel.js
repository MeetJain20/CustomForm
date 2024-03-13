const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const formSchema = new Schema({
    adminId: {type:mongoose.Types.ObjectId, required: true},
  formtitle: { type: String, required: true },
  formdesc: { type: String, required: true },
  fields: [{ type: Object, required: true }],
  isComplete: {type: Boolean, required: true},
  isTemplate: {type: Boolean, required: true}
});

module.exports = mongoose.model("FormModel", formSchema);
