const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  isDoctor: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  notifications: { type: Array, default: [] },
  resetToken: String,
  resetTokenExpiry: Date,
});

module.exports = mongoose.model("User", userSchema);