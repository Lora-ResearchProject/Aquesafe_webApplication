const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const vesselSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  vesselId: { type: String, required: true, unique: true },
  vesselName: { type: String, required: true },
  danger: { type: Boolean, default: false },
});

// Hash the password before saving
vesselSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords for vessel login
vesselSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Vessel", vesselSchema);
