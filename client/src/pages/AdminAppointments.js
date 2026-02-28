import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";

const AdminAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState({});
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const docRes = await api.get("/doctors/get-all-doctors");
            const map = {};
            docRes.data.forEach((d) => { map[d._id] = d; });
            setDoctors(map);
            // Get all appointments by fetching for each doctor
            const allAppts = [];
            for (const doc of docRes.data) {
                try {
                    const aRes = await api.get(`/appointments/doctor-appointments/${doc._id}`);
                    allAppts.push(...(aRes.data || []));
                } catch (_) { }
            }
            setAppointments(allAppts);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const statusColors = {
        pending: "badge-pending",
        scheduled: "badge-scheduled",
        approved: "badge-approved",
        rejected: "badge-rejected",
        cancelled: "badge-cancelled",
        completed: "badge-completed",
    };

    const filtered =
        filter === "all"
            ? appointments
            : appointments.filter((a) => a.status === filter);

    const counts = {
        all: appointments.length,
        pending: appointments.filter((a) => a.status === "pending").length,
        scheduled: appointments.filter((a) => a.status === "scheduled").length,
        completed: appointments.filter((a) => a.status === "completed").length,
        cancelled: appointments.filter((a) => a.status === "cancelled").length,
    };

    return (
        <Layout>
            <div className="page-header">
                <h1>📋 All Appointments</h1>
                <p>Monitor all platform appointments in real-time.</p>
            </div>

            {/* STATS */}
            <div className="stats-grid">
                {[
                    { label: "Total", value: counts.all, icon: "📋", cls: "blue" },
                    { label: "Pending", value: counts.pending, icon: "⏳", cls: "orange" },
                    { label: "Scheduled", value: counts.scheduled, icon: "✅", cls: "green" },
                    { label: "Completed", value: counts.completed, icon: "🎉", cls: "purple" },
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
                {["all", "pending", "scheduled", "completed", "cancelled"].map((tab) => (
                    <button
                        key={tab}
                        id={`appt-filter-${tab}`}
                        className={`btn btn-sm ${filter === tab ? "btn-primary" : "btn-outline"}`}
                        onClick={() => setFilter(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)} ({counts[tab] ?? appointments.filter(a => a.status === tab).length})
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
                        <div className="empty-icon">📋</div>
                        <h3>No appointments found</h3>
                        <p>No {filter !== "all" ? filter : ""} appointments yet.</p>
                    </div>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Doctor</th>
                                <th>Patient ID</th>
                                <th>Date</th>
                                <th>Document</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((appt, idx) => {
                                const doc = doctors[appt.doctorId];
                                return (
                                    <tr key={appt._id}>
                                        <td style={{ color: "var(--text-muted)", fontWeight: 600 }}>
                                            {String(idx + 1).padStart(2, "0")}
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>
                                                Dr. {doc?.fullname || "Unknown"}
                                            </div>
                                            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                                                {doc?.specialization}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                                                {appt.userId?.slice(-8)}…
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 600 }}>
                                            {appt.date
                                                ? new Date(appt.date).toLocaleDateString("en-IN", {
                                                    day: "2-digit", month: "short", year: "numeric",
                                                })
                                                : "—"}
                                        </td>
                                        <td>
                                            {appt.document ? (
                                                <a
                                                    href={`http://localhost:8080/uploads/${appt.document}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="btn btn-sm btn-outline"
                                                >
                                                    📎 View
                                                </a>
                                            ) : (
                                                <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>—</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`badge ${statusColors[appt.status] || "badge-pending"}`}>
                                                {appt.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </Layout>
    );
};

export default AdminAppointments;
