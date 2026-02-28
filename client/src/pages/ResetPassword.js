import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../utils/api";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token") || "";
    const email = searchParams.get("email") || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // If no token/email in URL, show invalid state
    if (!token || !email) {
        return (
            <div className="auth-wrapper">
                <div className="auth-right" style={{ width: "100%" }}>
                    <div className="auth-card slide-up" style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>❌</div>
                        <h2>Invalid Reset Link</h2>
                        <p className="subtitle">
                            This password reset link is invalid or has expired.
                        </p>
                        <Link to="/forgot-password" className="btn btn-primary" style={{ marginTop: 16 }}>
                            Request a New Link
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newPassword || !confirmPassword) {
            setError("Please fill in all fields."); return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters."); return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match."); return;
        }
        setLoading(true);
        setError("");
        try {
            const { data } = await api.post("/users/reset-password", {
                email,
                token,
                newPassword,
            });
            setSuccess(data);
            setTimeout(() => navigate("/login"), 2500);
        } catch (err) {
            const msg = err.response?.data || "Reset failed. Please try again.";
            setError(typeof msg === "string" ? msg : "Reset failed.");
        }
        setLoading(false);
    };

    const inputStyle = { position: "relative" };
    const eyeStyle = {
        position: "absolute", right: "12px", top: "50%",
        transform: "translateY(-50%)", background: "none", border: "none",
        cursor: "pointer", padding: 0, lineHeight: 1,
    };

    return (
        <div className="auth-wrapper">
            {/* LEFT */}
            <div className="auth-left">
                <div className="auth-left-content">
                    <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🔑</div>
                    <h1>Create a New <span>Password</span></h1>
                    <p>
                        Choose a strong password that you haven't used before
                        to keep your DocSpot account secure.
                    </p>
                    <ul className="auth-features">
                        <li><div className="feat-icon">🔒</div> At least 6 characters</li>
                        <li><div className="feat-icon">🔢</div> Mix letters & numbers</li>
                        <li><div className="feat-icon">✅</div> Unique to DocSpot</li>
                        <li><div className="feat-icon">🔁</div> You'll be logged in after reset</li>
                    </ul>
                </div>
            </div>

            {/* RIGHT */}
            <div className="auth-right">
                <div className="auth-card slide-up">
                    <div className="auth-logo">
                        <div className="brand-icon">❤️</div>
                        <span>DocSpot</span>
                    </div>
                    <h2>Set New Password</h2>
                    <p className="subtitle">
                        Creating new password for <strong>{email}</strong>
                    </p>

                    {error && <div className="alert alert-error">⚠️ {error}</div>}
                    {success && (
                        <div className="alert alert-success">
                            ✅ {success} Redirecting to login…
                        </div>
                    )}

                    {!success && (
                        <form onSubmit={handleSubmit}>
                            {/* New Password */}
                            <div className="form-group">
                                <label htmlFor="new-password">New Password</label>
                                <div style={inputStyle}>
                                    <input
                                        id="new-password"
                                        className="form-control"
                                        type={showNew ? "text" : "password"}
                                        placeholder="Min. 6 characters"
                                        value={newPassword}
                                        onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
                                        style={{ paddingRight: "44px" }}
                                    />
                                    <button type="button" style={eyeStyle} onClick={() => setShowNew(!showNew)} title={showNew ? "Hide" : "Show"}>
                                        <img src={showNew ? "/visibility.png" : "/visibility_off.png"} alt="" style={{ width: 20, height: 20, opacity: 0.6 }} />
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="form-group">
                                <label htmlFor="confirm-password">Confirm Password</label>
                                <div style={inputStyle}>
                                    <input
                                        id="confirm-password"
                                        className="form-control"
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="Re-enter new password"
                                        value={confirmPassword}
                                        onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                                        style={{ paddingRight: "44px" }}
                                    />
                                    <button type="button" style={eyeStyle} onClick={() => setShowConfirm(!showConfirm)} title={showConfirm ? "Hide" : "Show"}>
                                        <img src={showConfirm ? "/visibility.png" : "/visibility_off.png"} alt="" style={{ width: 20, height: 20, opacity: 0.6 }} />
                                    </button>
                                </div>

                                {/* Password match indicator */}
                                {confirmPassword && (
                                    <div style={{
                                        marginTop: 6, fontSize: "0.8rem", fontWeight: 600,
                                        color: newPassword === confirmPassword ? "#16a34a" : "#dc2626",
                                    }}>
                                        {newPassword === confirmPassword ? "✅ Passwords match" : "❌ Passwords do not match"}
                                    </div>
                                )}
                            </div>

                            <button
                                id="reset-submit"
                                type="submit"
                                className="btn btn-primary btn-block"
                                disabled={loading}
                                style={{ marginTop: "8px" }}
                            >
                                {loading ? "Resetting…" : "🔑 Reset Password"}
                            </button>
                        </form>
                    )}

                    <div className="divider" />
                    <p className="text-center text-muted">
                        <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
                            ← Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
