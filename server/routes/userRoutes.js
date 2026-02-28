const express = require("express");
const router = express.Router();
const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const authMiddleware = require("../middleware/authMiddleware");

// Register
router.post("/register", async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) return res.send("User already exists");

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const newUser = new User({
    ...req.body,
    password: hashedPassword,
  });

  await newUser.save();
  res.send("Registered Successfully");
});

// Login
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.send("User not found");

  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) return res.send("Invalid Credentials");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.send({
    success: true, token, user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isDoctor: user.isDoctor,
      isAdmin: user.isAdmin,
      notifications: user.notifications,
    }
  });
});

// Get profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId).select("-password");
    if (!user) return res.status(404).send("User not found");
    res.send(user);
  } catch (err) {
    res.status(500).send("Error fetching profile");
  }
});

// Get all users (admin only)
router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.send(users);
  } catch (err) {
    res.status(500).send("Error fetching users");
  }
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).send("Email is required.");

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("No account found with that email address.");
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Build reset link
    const resetLink = `http://localhost:3000/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"DocSpot" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "DocSpot – Password Reset Request",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
          <h2 style="color:#2563eb">❤️ DocSpot</h2>
          <h3>Password Reset Request</h3>
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>We received a request to reset your password. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
          <a href="${resetLink}" style="display:inline-block;margin:16px 0;padding:12px 28px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Reset My Password</a>
          <p style="color:#6b7280;font-size:0.85rem">If you didn't request this, you can safely ignore this email.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
          <p style="color:#9ca3af;font-size:0.75rem">DocSpot — Your Health, Our Priority</p>
        </div>
      `,
    });

    res.send("Password reset link sent to your email.");
  } catch (err) {
    console.error("Forgot password error:", err.message);
    res.status(500).send("Failed to send reset email. Please try again.");
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword)
      return res.status(400).send("All fields are required.");

    if (newPassword.length < 6)
      return res.status(400).send("Password must be at least 6 characters.");

    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found.");

    // Validate token & expiry
    if (user.resetToken !== token)
      return res.status(400).send("Invalid or expired reset link.");

    if (!user.resetTokenExpiry || Date.now() > user.resetTokenExpiry)
      return res.status(400).send("Reset link has expired. Please request a new one.");

    // Update password and clear token
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.send("Password reset successful. You can now log in.");
  } catch (err) {
    console.error("Reset password error:", err.message);
    res.status(500).send("Failed to reset password. Please try again.");
  }
});

module.exports = router;