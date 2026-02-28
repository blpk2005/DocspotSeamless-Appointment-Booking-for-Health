import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all required fields."); return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters."); return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/users/register", form);
      if (data === "Registered Successfully" || (typeof data === "string" && data.toLowerCase().includes("success"))) {
        setSuccess("Account created! Redirecting to login…");
        setTimeout(() => navigate("/login"), 1800);
      } else {
        setError(data || "Registration failed.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      {/* Logo watermark */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${process.env.PUBLIC_URL}/DocSpot_logo.png)`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "55%",
        opacity: 0.07,
        pointerEvents: "none",
        zIndex: 0,
      }} />
      <div className="auth-card-wrapper slide-up">
        <div className="auth-card">

          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <h2 style={{ marginBottom: "4px" }}>Create Account</h2>
            <p className="subtitle">Sign up to start booking appointments</p>
          </div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}
          {success && <div className="alert alert-success">✅ {success}</div>}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="reg-name">Full Name *</label>
              <input id="reg-name" className="form-control" type="text"
                name="name" placeholder="John Smith"
                value={form.name} onChange={handleChange} />
            </div>

            {/* Email + Phone */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reg-email">Email *</label>
                <input id="reg-email" className="form-control" type="email"
                  name="email" placeholder="you@example.com"
                  value={form.email} onChange={handleChange} autoComplete="email" />
              </div>
              <div className="form-group">
                <label htmlFor="reg-phone">Phone</label>
                <input id="reg-phone" className="form-control" type="tel"
                  name="phone" placeholder="9876543210"
                  value={form.phone} onChange={handleChange} />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="reg-password">Password *</label>
              <div style={{ position: "relative" }}>
                <input id="reg-password" className="form-control"
                  type={showPassword ? "text" : "password"}
                  name="password" placeholder="Min. 6 characters"
                  value={form.password} onChange={handleChange}
                  autoComplete="new-password" style={{ paddingRight: "44px" }} />
                <button type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: "12px", top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", cursor: "pointer", padding: 0, lineHeight: 1,
                  }}>
                  <img src={showPassword ? "/visibility.png" : "/visibility_off.png"}
                    alt={showPassword ? "Hide" : "Show"}
                    style={{ width: 20, height: 20, opacity: 0.5 }} />
                </button>
              </div>
            </div>

            <button id="register-submit" type="submit"
              className="btn btn-primary btn-block" disabled={loading}
              style={{ marginTop: "8px" }}>
              {loading ? "Creating account…" : "Create Account →"}
            </button>
          </form>

          <div className="divider" />
          <p className="text-center text-muted">
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--primary)", fontWeight: 700 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
