const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const adminSchema = new Schema({
  empName: { type: String, required: true },
  mobile: { type: Number, required: true },
  teamName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, required: true },
});

const saltNum = process.env.SALT_WORK_FACTOR;
adminSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(saltNum);
    this.password = await bcrypt.hash(this.password, Number(salt));
    return next();
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

module.exports = mongoose.model("AdminModel", adminSchema);
