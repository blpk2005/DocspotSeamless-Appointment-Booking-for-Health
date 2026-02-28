import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Authenticated Pages
import Home from "./pages/Home";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import ApplyDoctor from "./pages/ApplyDoctor";
import Notifications from "./pages/Notifications";

// Doctor Pages
import DoctorAppointments from "./pages/DoctorAppointments";

// Admin Pages
import AdminDoctors from "./pages/AdminDoctors";
import AdminUsers from "./pages/AdminUsers";
import AdminAppointments from "./pages/AdminAppointments";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public Pages (no login needed) ── */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ── Authenticated — All Users ── */}
          <Route path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

          {/* ── Patient Only ── */}
          <Route path="/book-appointment" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><MyAppointments /></ProtectedRoute>} />
          <Route path="/apply-doctor" element={<ProtectedRoute><ApplyDoctor /></ProtectedRoute>} />

          {/* ── Doctor Only ── */}
          <Route path="/doctor-appointments" element={<ProtectedRoute doctorOnly><DoctorAppointments /></ProtectedRoute>} />

          {/* ── Admin Only ── */}
          <Route path="/admin/doctors" element={<ProtectedRoute adminOnly><AdminDoctors /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/appointments" element={<ProtectedRoute adminOnly><AdminAppointments /></ProtectedRoute>} />

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;