import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) { setError("Please enter your email address."); return; }
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const { data } = await api.post("/users/forgot-password", { email });
            setSuccess(data);
        } catch (err) {
            const msg = err.response?.data || "Something went wrong. Please try again.";
            setError(typeof msg === "string" ? msg : "Something went wrong.");
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

                    <div style={{ textAlign: "center", marginBottom: "24px" }}>
                        <h2 style={{ marginBottom: "4px" }}>Forgot Password?</h2>
                        <p className="subtitle">Enter your registered email — we'll send a reset link instantly.</p>
                    </div>

                    {error && <div className="alert alert-error">⚠️ {error}</div>}
                    {success && (
                        <div className="alert alert-success">
                            ✅ {success}
                            <div style={{ marginTop: 8, fontSize: "0.82rem", color: "var(--success)" }}>
                                Check your inbox (and spam folder) for the reset link.
                            </div>
                        </div>
                    )}

                    {!success && (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="forgot-email">Email Address</label>
                                <input id="forgot-email" className="form-control" type="email"
                                    placeholder="you@example.com" value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                    autoComplete="email" />
                            </div>
                            <button id="forgot-submit" type="submit"
                                className="btn btn-primary btn-block" disabled={loading}
                                style={{ marginTop: "8px" }}>
                                {loading ? "Sending…" : "📧 Send Reset Link"}
                            </button>
                        </form>
                    )}

                    <div className="divider" />
                    <p className="text-center text-muted">
                        Remember your password?{" "}
                        <Link to="/login" style={{ color: "var(--primary)", fontWeight: 700 }}>Back to Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
