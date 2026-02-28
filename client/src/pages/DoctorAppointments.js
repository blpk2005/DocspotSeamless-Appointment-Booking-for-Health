import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";

const SPECIALIZATIONS = [
    "General Physician", "Cardiologist", "Dermatologist", "Neurologist",
    "Orthopedic", "Pediatrician", "Psychiatrist", "Gynecologist",
    "Ophthalmologist", "ENT Specialist", "Dentist", "Urologist",
    "Endocrinologist", "Gastroenterologist", "Pulmonologist",
];

const statusColors = {
    pending: "badge-pending", scheduled: "badge-approved",
    approved: "badge-approved", rejected: "badge-rejected",
    cancelled: "badge-rejected", completed: "badge-pending",
};

const DoctorAppointments = () => {
    const [tab, setTab] = useState("appointments");
    const [appointments, setAppointments] = useState([]);
    const [doctorProfile, setDoctorProfile] = useState(null);
    const [users, setUsers] = useState({});
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    // Edit profile state
    const [editForm, setEditForm] = useState(null);
    const [saving, setSaving] = useState(false);
    const [editSuccess, setEditSuccess] = useState("");
    const [editError, setEditError] = useState("");

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const { data } = await api.get("/appointments/my-appointments");
            setDoctorProfile(data.doctor || null);
            setAppointments(data.appointments || []);
            if (data.doctor) {
                setEditForm({
                    fullname: data.doctor.fullname || "",
                    phone: data.doctor.phone || "",
                    address: data.doctor.address || "",
                    specialization: data.doctor.specialization || "",
                    experience: data.doctor.experience || "",
                    fees: data.doctor.fees || "",
                    timings: data.doctor.timings?.length ? data.doctor.timings : [""],
                });
            }
            try {
                const usersRes = await api.get("/users/get-all-users");
                const map = {};
                (usersRes.data || []).forEach(u => { map[u._id] = u; });
                setUsers(map);
            } catch (_) { }
        } catch (err) {
            console.error("Doctor dashboard error:", err.response?.data || err.message);
        }
        setLoading(false);
    };

    const updateStatus = async (appointmentId, status) => {
        setUpdating(appointmentId);
        try {
            await api.post("/appointments/update-status", { appointmentId, status });
            await fetchData();
        } catch (err) { alert("Failed to update status."); }
        setUpdating(null);
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
        setEditError(""); setEditSuccess("");
    };

    const handleTimingChange = (idx, val) => {
        const t = [...editForm.timings]; t[idx] = val;
        setEditForm({ ...editForm, timings: t });
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true); setEditError(""); setEditSuccess("");
        try {
            const { data } = await api.put("/doctors/update-profile", {
                ...editForm,
                fees: Number(editForm.fees),
                timings: editForm.timings.filter(Boolean),
            });
            setEditSuccess(data);
            await fetchData();
        } catch (err) {
            setEditError(err.response?.data || "Failed to save changes.");
        }
        setSaving(false);
    };

    const getStatusIcon = (s) =>
        ({ pending: "⏳", scheduled: "✅", approved: "✅", rejected: "❌", cancelled: "🚫", completed: "🎉" }[s] || "•");

    const stats = {
        total: appointments.length,
        pending: appointments.filter(a => a.status === "pending").length,
        scheduled: appointments.filter(a => a.status === "scheduled").length,
        completed: appointments.filter(a => a.status === "completed").length,
    };

    const getInitials = (name = "") =>
        name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

    return (
        <Layout>
            {/* HEADER */}
            <div className="page-header-row">
                <div className="page-header" style={{ marginBottom: 0 }}>
                    <h1>🩺 Doctor Dashboard</h1>
                    <p>Manage appointments and update your profile.</p>
                </div>
                {doctorProfile && (
                    <div style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        background: "var(--white)", border: "1px solid var(--border)",
                        borderRadius: "var(--radius-sm)", padding: "10px 16px",
                        boxShadow: "var(--card-shadow)"
                    }}>
                        <div style={{
                            width: 42, height: 42, borderRadius: "50%",
                            background: "linear-gradient(135deg, var(--primary), var(--accent))",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "white", fontWeight: 700, fontSize: "1rem"
                        }}>
                            {getInitials(doctorProfile.fullname)}
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Dr. {doctorProfile.fullname}</div>
                            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{doctorProfile.specialization}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* STATS */}
            <div className="stats-grid" style={{ marginTop: "24px" }}>
                {[
                    { label: "Total", value: stats.total, icon: "📋", cls: "blue" },
                    { label: "Pending", value: stats.pending, icon: "⏳", cls: "orange" },
                    { label: "Scheduled", value: stats.scheduled, icon: "✅", cls: "green" },
                    { label: "Completed", value: stats.completed, icon: "🎉", cls: "purple" },
                ].map(s => (
                    <div className="stat-card" key={s.label}>
                        <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
                        <div className="stat-info"><h3>{s.value}</h3><p>{s.label}</p></div>
                    </div>
                ))}
            </div>

            {/* TABS */}
            <div style={{ display: "flex", gap: "8px", margin: "24px 0 20px" }}>
                {[
                    { id: "appointments", label: `📋 Appointments (${stats.total})` },
                    { id: "profile", label: "✏️ Edit Profile" },
                ].map(t => (
                    <button
                        key={t.id}
                        id={`tab-${t.id}`}
                        className={`btn ${tab === t.id ? "btn-primary" : "btn-outline"}`}
                        onClick={() => setTab(t.id)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
                    <div className="spinner" />
                </div>
            ) : !doctorProfile ? (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-icon">🩺</div>
                        <h3>Doctor profile not found</h3>
                        <p>Your profile may not be approved yet. Contact admin.</p>
                    </div>
                </div>
            ) : tab === "appointments" ? (
                /* ── APPOINTMENTS TAB ── */
                appointments.length === 0 ? (
                    <div className="card">
                        <div className="empty-state">
                            <div className="empty-icon">📋</div>
                            <h3>No appointments yet</h3>
                            <p>You have no incoming appointments at the moment.</p>
                        </div>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Patient</th>
                                    <th>Date</th>
                                    <th>Document</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((appt, idx) => (
                                    <tr key={appt._id}>
                                        <td style={{ color: "var(--text-muted)", fontWeight: 600 }}>
                                            {String(idx + 1).padStart(2, "0")}
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <div style={{
                                                    width: 32, height: 32, borderRadius: "50%",
                                                    background: "linear-gradient(135deg, var(--primary-light), #dbeafe)",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    fontWeight: 700, color: "var(--primary)", fontSize: "0.75rem"
                                                }}>
                                                    {users[appt.userId]?.name?.[0]?.toUpperCase() || "?"}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                                                        {users[appt.userId]?.name || "Patient"}
                                                    </div>
                                                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                                        {users[appt.userId]?.phone || users[appt.userId]?.email || ""}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>
                                                {appt.date ? new Date(appt.date + "T12:00:00").toLocaleDateString("en-IN", {
                                                    day: "2-digit", month: "short", year: "numeric"
                                                }) : "—"}
                                            </div>
                                        </td>
                                        <td>
                                            {appt.document ? (
                                                <a href={`http://localhost:8080/uploads/${appt.document}`}
                                                    target="_blank" rel="noreferrer" className="btn btn-sm btn-outline">
                                                    📎 View
                                                </a>
                                            ) : <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>—</span>}
                                        </td>
                                        <td>
                                            <span className={`badge ${statusColors[appt.status] || "badge-pending"}`}>
                                                {getStatusIcon(appt.status)} {appt.status || "pending"}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                                {appt.status === "pending" && (<>
                                                    <button id={`approve-${appt._id}`} className="btn btn-success btn-sm"
                                                        disabled={updating === appt._id}
                                                        onClick={() => updateStatus(appt._id, "scheduled")}>
                                                        {updating === appt._id ? "…" : "✅ Approve"}
                                                    </button>
                                                    <button id={`reject-${appt._id}`} className="btn btn-danger btn-sm"
                                                        disabled={updating === appt._id}
                                                        onClick={() => updateStatus(appt._id, "rejected")}>
                                                        ❌ Reject
                                                    </button>
                                                </>)}
                                                {appt.status === "scheduled" && (
                                                    <button id={`complete-${appt._id}`} className="btn btn-sm"
                                                        style={{ background: "#ede9fe", color: "var(--accent)", fontWeight: 600 }}
                                                        disabled={updating === appt._id}
                                                        onClick={() => updateStatus(appt._id, "completed")}>
                                                        🎉 Complete
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ) : (
                /* ── EDIT PROFILE TAB ── */
                <div className="card" style={{ maxWidth: 680 }}>
                    <div className="card-title">✏️ Edit Your Profile</div>
                    <div className="card-subtitle">Update your professional information visible to patients.</div>

                    {editSuccess && <div className="alert alert-success" style={{ marginTop: 16 }}>✅ {editSuccess}</div>}
                    {editError && <div className="alert alert-error" style={{ marginTop: 16 }}>⚠️ {editError}</div>}

                    {editForm && (
                        <form onSubmit={handleSaveProfile} style={{ marginTop: 20 }}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="edit-fullname">Full Name</label>
                                    <input id="edit-fullname" className="form-control" name="fullname"
                                        value={editForm.fullname} onChange={handleEditChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="edit-phone">Phone</label>
                                    <input id="edit-phone" className="form-control" name="phone"
                                        type="tel" value={editForm.phone} onChange={handleEditChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="edit-address">Clinic Address</label>
                                <input id="edit-address" className="form-control" name="address"
                                    value={editForm.address} onChange={handleEditChange} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="edit-spec">Specialization</label>
                                    <select id="edit-spec" className="form-control" name="specialization"
                                        value={editForm.specialization} onChange={handleEditChange}>
                                        <option value="">-- Select --</option>
                                        {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="edit-exp">Experience (years)</label>
                                    <input id="edit-exp" className="form-control" name="experience"
                                        type="number" min="0" value={editForm.experience} onChange={handleEditChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="edit-fees">Consultation Fees (₹)</label>
                                <input id="edit-fees" className="form-control" name="fees"
                                    type="number" min="0" value={editForm.fees} onChange={handleEditChange} />
                            </div>
                            <div className="form-group">
                                <label>Available Timings</label>
                                {editForm.timings.map((t, idx) => (
                                    <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                                        <input className="form-control" placeholder="e.g. 9:00 AM - 1:00 PM"
                                            value={t} onChange={e => handleTimingChange(idx, e.target.value)} />
                                        {editForm.timings.length > 1 && (
                                            <button type="button" className="btn btn-danger btn-sm"
                                                onClick={() => setEditForm({
                                                    ...editForm,
                                                    timings: editForm.timings.filter((_, i) => i !== idx)
                                                })}>✕</button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" className="btn btn-outline btn-sm" style={{ marginTop: 4 }}
                                    onClick={() => setEditForm({ ...editForm, timings: [...editForm.timings, ""] })}>
                                    + Add Timing
                                </button>
                            </div>
                            <div className="divider" />
                            <button id="save-profile" type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? "Saving…" : "💾 Save Changes"}
                            </button>
                        </form>
                    )}
                </div>
            )}
        </Layout>
    );
};

export default DoctorAppointments;
