const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  userId: String,
  doctorId: String,
  date: String,
  document: String,
  status: { type: String, default: "pending" }
});

module.exports = mongoose.model("Appointment", appointmentSchema);