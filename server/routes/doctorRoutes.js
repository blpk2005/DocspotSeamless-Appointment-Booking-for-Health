const express = require("express");
const router = express.Router();
const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");
const authMiddleware = require("../middleware/authMiddleware");

// Apply Doctor
router.post("/apply-doctor", authMiddleware, async (req, res) => {
  try {
    // If already approved/rejected — block resubmission
    const existing = await Doctor.findOne({ userId: req.body.userId });
    if (existing && (existing.status === "approved" || existing.status === "rejected")) {
      return res.status(400).send(
        existing.status === "approved"
          ? "Your doctor account is already approved."
          : "Your application was rejected. Please contact support."
      );
    }

    let savedDoctor;
    if (existing) {
      // Pending — allow updating with fresh details
      Object.assign(existing, { ...req.body, status: "pending" });
      savedDoctor = await existing.save();
    } else {
      const newDoctor = new Doctor({
        ...req.body,
        userId: req.body.userId,
        status: "pending",
      });
      savedDoctor = await newDoctor.save();
    }

    // Notify admin (non-fatal)
    try {
      const adminUser = await User.findOne({ isAdmin: true });
      if (adminUser) {
        adminUser.notifications.push({
          type: "doctor-request",
          message: `${savedDoctor.fullname} applied for doctor account`,
        });
        await adminUser.save();
      }
    } catch (notifyErr) {
      console.error("Admin notification failed (non-fatal):", notifyErr.message);
    }

    res.send("Doctor Application Submitted");
  } catch (error) {
    console.error("Apply doctor error:", error.message);
    res.status(500).send("Error applying doctor");
  }
});
router.get("/get-all-doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.send(doctors);
  } catch (err) {
    res.status(500).send("Error fetching doctors");
  }
});
router.post("/change-status", authMiddleware, async (req, res) => {
  try {
    const { doctorId, status } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(doctorId, { status });

    const user = await User.findById(doctor.userId);

    if (status === "approved") {
      user.isDoctor = true;
    }

    user.notifications.push({
      type: "doctor-status",
      message: `Your doctor account has been ${status}`,
    });

    await user.save();

    res.send("Doctor status updated");
  } catch (error) {
    res.status(500).send("Error updating status");
  }
});

// Update Doctor Profile
router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    if (!doctor) return res.status(404).send("Doctor profile not found.");

    const { fullname, phone, address, specialization, experience, fees, timings } = req.body;
    if (fullname) doctor.fullname = fullname;
    if (phone) doctor.phone = phone;
    if (address) doctor.address = address;
    if (specialization) doctor.specialization = specialization;
    if (experience) doctor.experience = experience;
    if (fees) doctor.fees = Number(fees);
    if (timings) doctor.timings = timings;

    await doctor.save();
    res.send("Profile updated successfully.");
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).send("Failed to update profile.");
  }
});

module.exports = router;