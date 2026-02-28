const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// ── CORS ─────────────────────────────────────────────────────────
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200, // some browsers (IE11) choke on 204
};

app.use(cors(corsOptions));

// Handle ALL preflight OPTIONS requests immediately
app.options("/{*splat}", cors(corsOptions));

// ── BODY PARSING ──────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── ROUTES ───────────────────────────────────────────────────────
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));

// ── STATIC FILES ─────────────────────────────────────────────────
app.use("/uploads", express.static("uploads"));

// ── START ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});