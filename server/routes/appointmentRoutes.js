const express = require("express");
const router = express.Router();

const Appointment = require("../models/appointmentModel");
const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");
const authMiddleware = require("../middleware/authMiddleware");

// ================= MULTER CONFIG =================
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ================= BOOK APPOINTMENT =================
router.post(
  "/book-appointment",
  upload.single("document"),  // multer FIRST — populates req.body before auth reads it
  authMiddleware,
  async (req, res) => {
    try {
      const newAppointment = new Appointment({
        userId: req.body.userId,
        doctorId: req.body.doctorId,
        date: req.body.date,
        document: req.file ? req.file.filename : null,
        status: "pending",
      });

      await newAppointment.save();

      // Notify doctor (non-fatal)
      try {
        const doctor = await Doctor.findById(req.body.doctorId);
        if (doctor) {
          const doctorUser = await User.findById(doctor.userId);
          if (doctorUser) {
            doctorUser.notifications.push({
              type: "appointment-request",
              message: "New appointment request received",
            });
            await doctorUser.save();
          }
        }
      } catch (notifyErr) {
        console.error("Doctor notification failed (non-fatal):", notifyErr.message);
      }

      res.send("Appointment booked successfully");
    } catch (error) {
      console.error("Booking error:", error.message);
      res.status(500).send("Booking failed");
    }
  }
);

// ================= USER APPOINTMENTS =================
router.post("/user-appointments", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      userId: req.body.userId,
    });
    res.send(appointments);
  } catch (error) {
    res.status(500).send("Error fetching appointments");
  }
});

// ================= DOCTOR OWN APPOINTMENTS (by JWT userId) =================
router.get("/my-appointments", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    if (!doctor) return res.status(404).send("Doctor profile not found.");
    const appointments = await Appointment.find({ doctorId: doctor._id.toString() });
    res.send({ doctor, appointments });
  } catch (error) {
    console.error("my-appointments error:", error.message);
    res.status(500).send("Error fetching appointments");
  }
});

// ================= DOCTOR APPOINTMENTS (by doctorId param) =================
router.get(
  "/doctor-appointments/:doctorId",
  authMiddleware,
  async (req, res) => {
    try {
      const appointments = await Appointment.find({
        doctorId: req.params.doctorId,
      });
      res.send(appointments);
    } catch (error) {
      res.status(500).send("Error fetching doctor appointments");
    }
  }
);

// ================= UPDATE STATUS =================
router.post("/update-status", authMiddleware, async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    const user = await User.findById(appointment.userId);

    user.notifications.push({
      type: "appointment-status",
      message: `Your appointment has been ${status}`,
    });

    await user.save();

    res.send("Appointment updated");
  } catch (error) {
    res.status(500).send("Error updating appointment");
  }
});

// ================= EXPORT =================
module.exports = router;