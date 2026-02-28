const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  userId: String,
  fullname: String,
  email: String,
  phone: String,
  address: String,
  specialization: String,
  experience: String,
  fees: Number,
  timings: Array,
  status: { type: String, default: "pending" }
});

module.exports = mongoose.model("Doctor", doctorSchema);