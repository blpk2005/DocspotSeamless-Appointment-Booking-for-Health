import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        api.get("/users/get-all-users")
            .then(({ data }) => setUsers(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = users.filter(
        (u) =>
            !search ||
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase())
    );

    const getInitials = (name = "") =>
        name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

    return (
        <Layout>
            <div className="page-header">
                <h1>👥 All Users</h1>
                <p>View all registered users on the platform.</p>
            </div>

            {/* STATS */}
            <div className="stats-grid">
                {[
                    { label: "Total Users", value: users.length, icon: "👥", cls: "blue" },
                    { label: "Doctors", value: users.filter(u => u.isDoctor).length, icon: "🩺", cls: "green" },
                    { label: "Admins", value: users.filter(u => u.isAdmin).length, icon: "🛡️", cls: "purple" },
                    { label: "Patients", value: users.filter(u => !u.isDoctor && !u.isAdmin).length, icon: "🏥", cls: "orange" },
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

            {/* SEARCH */}
            <div className="search-bar">
                <div className="search-input-wrap">
                    <span className="search-icon">🔍</span>
                    <input
                        id="user-search"
                        className="search-input"
                        type="text"
                        placeholder="Search by name or email…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
                    <div className="spinner" />
                </div>
            ) : (
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>User</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Notifications</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((user, idx) => (
                                <tr key={user._id}>
                                    <td style={{ color: "var(--text-muted)", fontWeight: 600 }}>
                                        {String(idx + 1).padStart(2, "0")}
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: "50%",
                                                background: "linear-gradient(135deg, var(--primary-light), #dbeafe)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontWeight: 700, color: "var(--primary)", fontSize: "0.8rem",
                                                flexShrink: 0
                                            }}>
                                                {getInitials(user.name)}
                                            </div>
                                            <div style={{ fontWeight: 600 }}>{user.name}</div>
                                        </div>
                                    </td>
                                    <td style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                                        {user.email}
                                    </td>
                                    <td style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                                        {user.phone || "—"}
                                    </td>
                                    <td>
                                        {user.isAdmin ? (
                                            <span className="badge" style={{ background: "#ede9fe", color: "var(--accent)" }}>🛡️ Admin</span>
                                        ) : user.isDoctor ? (
                                            <span className="badge badge-approved">🩺 Doctor</span>
                                        ) : (
                                            <span className="badge" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>👤 Patient</span>
                                        )}
                                    </td>
                                    <td>
                                        <span style={{
                                            background: user.notifications?.length ? "#fef3c7" : "var(--bg)",
                                            color: user.notifications?.length ? "#b45309" : "var(--text-muted)",
                                            padding: "3px 10px", borderRadius: 99, fontSize: "0.78rem", fontWeight: 600
                                        }}>
                                            {user.notifications?.length || 0}
                                        </span>
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

export default AdminUsers;
