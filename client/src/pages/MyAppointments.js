import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";

const statusColors = {
    pending: "badge-pending",
    scheduled: "badge-scheduled",
    approved: "badge-approved",
    rejected: "badge-rejected",
    cancelled: "badge-cancelled",
    completed: "badge-completed",
};

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [doctorsMap, setDoctorsMap] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [apptRes, docRes] = await Promise.all([
                api.post("/appointments/user-appointments", {}),
                api.get("/doctors/get-all-doctors"),
            ]);
            setAppointments(apptRes.data || []);
            const map = {};
            (docRes.data || []).forEach((d) => { map[d._id] = d; });
            setDoctorsMap(map);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const updateStatus = async (appointmentId, status) => {
        setUpdating(appointmentId);
        try {
            await api.post("/appointments/update-status", { appointmentId, status });
            await fetchData();
        } catch (err) {
            alert("Failed to update status.");
        }
        setUpdating(null);
    };

    const getStatusIcon = (s) =>
        ({ pending: "⏳", scheduled: "✅", approved: "✅", rejected: "❌", cancelled: "🚫", completed: "🎉" }[s] || "•");

    return (
        <Layout>
            <div className="page-header">
                <h1>📋 My Appointments</h1>
                <p>View and manage all your appointment bookings.</p>
            </div>

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
                    <div className="spinner" />
                </div>
            ) : appointments.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <h3>No appointments yet</h3>
                        <p>You haven't booked any appointments. Go ahead and book one!</p>
                    </div>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Doctor</th>
                                <th>Specialty</th>
                                <th>Date</th>
                                <th>Document</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appt, idx) => {
                                const doc = doctorsMap[appt.doctorId];
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
                                                {doc?.phone || ""}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge-pending" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
                                                {doc?.specialization || "—"}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>
                                                {appt.date
                                                    ? new Date(appt.date).toLocaleDateString("en-IN", {
                                                        day: "2-digit", month: "short", year: "numeric",
                                                    })
                                                    : "—"}
                                            </div>
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
                                                {getStatusIcon(appt.status)} {appt.status || "pending"}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                                {appt.status === "pending" || appt.status === "scheduled" ? (
                                                    <button
                                                        id={`cancel-${appt._id}`}
                                                        className="btn btn-danger btn-sm"
                                                        disabled={updating === appt._id}
                                                        onClick={() => updateStatus(appt._id, "cancelled")}
                                                    >
                                                        {updating === appt._id ? "…" : "Cancel"}
                                                    </button>
                                                ) : null}
                                                {appt.status === "scheduled" && (
                                                    <button
                                                        id={`complete-${appt._id}`}
                                                        className="btn btn-sm"
                                                        style={{ background: "#ede9fe", color: "var(--accent)", fontWeight: 600 }}
                                                        disabled={updating === appt._id}
                                                        onClick={() => updateStatus(appt._id, "completed")}
                                                    >
                                                        Done
                                                    </button>
                                                )}
                                            </div>
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

export default MyAppointments;
