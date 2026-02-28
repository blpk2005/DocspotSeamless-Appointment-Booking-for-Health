import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const SPECIALIZATIONS = [
    "General Physician", "Cardiologist", "Dermatologist", "Neurologist",
    "Orthopedic", "Pediatrician", "Psychiatrist", "Gynecologist",
    "Ophthalmologist", "ENT Specialist", "Dentist", "Urologist",
    "Endocrinologist", "Gastroenterologist", "Pulmonologist",
];

const ApplyDoctor = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        fullname: user?.name || "",
        phone: user?.phone || "",
        email: user?.email || "",
        address: "",
        specialization: "",
        experience: "",
        fees: "",
        timings: [""],
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleTimingChange = (idx, val) => {
        const updated = [...form.timings];
        updated[idx] = val;
        setForm({ ...form, timings: updated });
    };

    const addTiming = () => setForm({ ...form, timings: [...form.timings, ""] });
    const removeTiming = (idx) => {
        const updated = form.timings.filter((_, i) => i !== idx);
        setForm({ ...form, timings: updated });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.fullname || !form.specialization || !form.fees || !form.experience) {
            setError("Please fill in all required fields.");
            return;
        }
        setLoading(true);
        try {
            const payload = {
                ...form,
                userId: user._id,
                fees: Number(form.fees),
                timings: form.timings.filter(Boolean),
            };
            const { data } = await api.post("/doctors/apply-doctor", payload);
            if (typeof data === "string" && data.toLowerCase().includes("submitted")) {
                setSuccess("🎉 Application submitted! The admin will review and approve your profile shortly.");
                setTimeout(() => navigate("/"), 2800);
            } else {
                setError(data || "Application failed.");
            }
        } catch (err) {
            const msg = err.response?.data || err.message || "Submission failed. Please try again.";
            setError(typeof msg === "string" ? msg : "Submission failed. Please try again.");
        }
        setLoading(false);
    };

    return (
        <Layout>
            <div className="page-header">
                <h1>🩺 Apply as a Doctor</h1>
                <p>Fill in your professional details to join the DocSpot network.</p>
            </div>

            <div style={{ maxWidth: 720 }}>
                <div className="card">
                    <div
                        style={{
                            background: "linear-gradient(135deg, var(--primary-light), #ede9fe)",
                            borderRadius: "var(--radius-sm)",
                            padding: "16px 20px",
                            marginBottom: "24px",
                            display: "flex", alignItems: "center", gap: "12px"
                        }}
                    >
                        <span style={{ fontSize: "1.5rem" }}>ℹ️</span>
                        <div>
                            <div style={{ fontWeight: 700, color: "var(--dark)", fontSize: "0.9rem" }}>
                                Application Process
                            </div>
                            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "2px" }}>
                                After submission, the admin will review your profile and approve within 24–48 hours.
                            </div>
                        </div>
                    </div>

                    {success && <div className="alert alert-success">{success}</div>}
                    {error && <div className="alert alert-error">⚠️ {error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div
                            style={{
                                fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase",
                                letterSpacing: "0.08em", color: "var(--text-muted)",
                                marginBottom: "12px"
                            }}
                        >
                            Personal Information
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="dr-fullname">Full Name *</label>
                                <input
                                    id="dr-fullname"
                                    className="form-control"
                                    type="text"
                                    name="fullname"
                                    placeholder="Dr. John Smith"
                                    value={form.fullname}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="dr-email">Email *</label>
                                <input
                                    id="dr-email"
                                    className="form-control"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="dr-phone">Phone *</label>
                                <input
                                    id="dr-phone"
                                    className="form-control"
                                    type="tel"
                                    name="phone"
                                    placeholder="+1 234 567 890"
                                    value={form.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="dr-address">Clinic Address *</label>
                                <input
                                    id="dr-address"
                                    className="form-control"
                                    type="text"
                                    name="address"
                                    placeholder="123 Medical St, City"
                                    value={form.address}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="divider" />
                        <div
                            style={{
                                fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase",
                                letterSpacing: "0.08em", color: "var(--text-muted)",
                                marginBottom: "12px"
                            }}
                        >
                            Professional Details
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="dr-spec">Specialization *</label>
                                <select
                                    id="dr-spec"
                                    className="form-control"
                                    name="specialization"
                                    value={form.specialization}
                                    onChange={handleChange}
                                >
                                    <option value="">-- Select specialty --</option>
                                    {SPECIALIZATIONS.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="dr-exp">Years of Experience *</label>
                                <input
                                    id="dr-exp"
                                    className="form-control"
                                    type="number"
                                    name="experience"
                                    min="0"
                                    max="60"
                                    placeholder="e.g. 5"
                                    value={form.experience}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="dr-fees">Consultation Fees (₹) *</label>
                            <input
                                id="dr-fees"
                                className="form-control"
                                type="number"
                                name="fees"
                                min="0"
                                placeholder="e.g. 500"
                                value={form.fees}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Available Timings</label>
                            {form.timings.map((t, idx) => (
                                <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                                    <input
                                        className="form-control"
                                        type="text"
                                        placeholder="e.g. 9:00 AM - 1:00 PM"
                                        value={t}
                                        onChange={(e) => handleTimingChange(idx, e.target.value)}
                                    />
                                    {form.timings.length > 1 && (
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => removeTiming(idx)}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                onClick={addTiming}
                                style={{ marginTop: "4px" }}
                            >
                                + Add Timing Slot
                            </button>
                        </div>

                        <div className="divider" />

                        <button
                            id="apply-doctor-submit"
                            type="submit"
                            className="btn btn-primary btn-block"
                            disabled={loading}
                        >
                            {loading ? "Submitting…" : "🩺 Submit Application"}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default ApplyDoctor;
