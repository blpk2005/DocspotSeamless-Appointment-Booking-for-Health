import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";

const AdminDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/doctors/get-all-doctors");
            setDoctors(data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const changeStatus = async (doctorId, status) => {
        setUpdating(doctorId);
        try {
            await api.post("/doctors/change-status", { doctorId, status });
            await fetchDoctors();
        } catch (err) {
            alert("Error updating doctor status.");
        }
        setUpdating(null);
    };

    const filtered =
        filter === "all" ? doctors : doctors.filter((d) => d.status === filter);

    const counts = {
        all: doctors.length,
        pending: doctors.filter((d) => d.status === "pending").length,
        approved: doctors.filter((d) => d.status === "approved").length,
        rejected: doctors.filter((d) => d.status === "rejected").length,
    };

    const getInitials = (name = "") =>
        name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

    return (
        <Layout>
            <div className="page-header">
                <h1>👨‍⚕️ Manage Doctors</h1>
                <p>Review doctor applications and manage their platform access.</p>
            </div>

            {/* STATS */}
            <div className="stats-grid">
                {[
                    { label: "Total Applied", value: counts.all, icon: "👨‍⚕️", cls: "blue" },
                    { label: "Pending Review", value: counts.pending, icon: "⏳", cls: "orange" },
                    { label: "Approved", value: counts.approved, icon: "✅", cls: "green" },
                    { label: "Rejected", value: counts.rejected, icon: "❌", cls: "purple" },
                ].map((s) => (
                    <div className="stat-card" key={s.label}>
                        <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
                        <div className="stat-info">
                            <h3>{s.value}</h3>
                            <p>{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* FILTER TABS */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                {["all", "pending", "approved", "rejected"].map((tab) => (
                    <button
                        key={tab}
                        id={`filter-${tab}`}
                        className={`btn btn-sm ${filter === tab ? "btn-primary" : "btn-outline"}`}
                        onClick={() => setFilter(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)} ({counts[tab]})
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
                    <div className="spinner" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-icon">👨‍⚕️</div>
                        <h3>No doctors found</h3>
                        <p>No {filter !== "all" ? filter : ""} doctor applications yet.</p>
                    </div>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Doctor</th>
                                <th>Specialty</th>
                                <th>Experience</th>
                                <th>Phone</th>
                                <th>Fees</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((doc) => (
                                <tr key={doc._id}>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: "50%",
                                                background: "linear-gradient(135deg, var(--primary-light), #dbeafe)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontWeight: 700, color: "var(--primary)", fontSize: "0.8rem",
                                                flexShrink: 0
                                            }}>
                                                {getInitials(doc.fullname)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700 }}>Dr. {doc.fullname}</div>
                                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                                    {doc.address}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
                                            {doc.specialization || "—"}
                                        </span>
                                    </td>
                                    <td>{doc.experience ? `${doc.experience} yrs` : "—"}</td>
                                    <td>{doc.phone || "—"}</td>
                                    <td style={{ fontWeight: 700, color: "var(--primary)" }}>
                                        ₹{doc.fees}
                                    </td>
                                    <td>
                                        <span
                                            className={`badge ${doc.status === "approved"
                                                    ? "badge-approved"
                                                    : doc.status === "rejected"
                                                        ? "badge-rejected"
                                                        : "badge-pending"
                                                }`}
                                        >
                                            {doc.status === "approved" ? "✅" : doc.status === "rejected" ? "❌" : "⏳"}{" "}
                                            {doc.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", gap: "6px" }}>
                                            {doc.status !== "approved" && (
                                                <button
                                                    id={`approve-dr-${doc._id}`}
                                                    className="btn btn-success btn-sm"
                                                    disabled={updating === doc._id}
                                                    onClick={() => changeStatus(doc._id, "approved")}
                                                >
                                                    {updating === doc._id ? "…" : "✅ Approve"}
                                                </button>
                                            )}
                                            {doc.status !== "rejected" && (
                                                <button
                                                    id={`reject-dr-${doc._id}`}
                                                    className="btn btn-danger btn-sm"
                                                    disabled={updating === doc._id}
                                                    onClick={() => changeStatus(doc._id, "rejected")}
                                                >
                                                    ❌ Reject
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Layout>
    );
};

export default AdminDoctors;
