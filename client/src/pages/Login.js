import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/users/login", form);
      if (data.success && data.user) {
        login(data.token, data.user);
        navigate("/dashboard");
      } else {
        setError(typeof data === "string" ? data : (data.message || "Invalid email or password."));
      }
    } catch (err) {
      const msg = err.response?.data;
      setError(typeof msg === "string" ? msg : (msg?.message || "Unable to connect. Please check your internet or try again."));
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
            <h2 style={{ marginBottom: "4px" }}>Welcome Back</h2>
            <p className="subtitle">Sign in to your DocSpot account to continue</p>
          </div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                className="form-control"
                type="email" name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="login-password"
                  className="form-control"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  style={{ paddingRight: "44px" }}
                />
                <button type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: "12px", top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", cursor: "pointer", padding: 0, lineHeight: 1,
                  }}>
                  <img
                    src={showPassword ? "/visibility.png" : "/visibility_off.png"}
                    alt={showPassword ? "Hide" : "Show"}
                    style={{ width: 20, height: 20, opacity: 0.5 }}
                  />
                </button>
              </div>
            </div>

            {/* Forgot */}
            <div style={{ textAlign: "right", marginTop: "-6px", marginBottom: "20px" }}>
              <Link to="/forgot-password"
                style={{ fontSize: "0.82rem", color: "var(--primary)", fontWeight: 600 }}>
                Forgot password?
              </Link>
            </div>

            <button id="login-submit" type="submit"
              className="btn btn-primary btn-block" disabled={loading}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <div className="divider" />

          <p className="text-center text-muted">
            New to DocSpot?{" "}
            <Link to="/register" style={{ color: "var(--primary)", fontWeight: 700 }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
