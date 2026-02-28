import React, { useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const Notifications = () => {
    const { user, setUser } = useAuth();
    const [clearing, setClearing] = useState(false);
    const notifications = user?.notifications || [];

    const getIcon = (type) => {
        const map = {
            "doctor-request": { icon: "🩺", cls: "blue" },
            "doctor-status": { icon: "✅", cls: "green" },
            "appointment-request": { icon: "📅", cls: "blue" },
            "appointment-status": { icon: "🔔", cls: "orange" },
        };
        return map[type] || { icon: "🔔", cls: "blue" };
    };

    const clearAll = async () => {
        setClearing(true);
        try {
            // Mark all as read by clearing client-side (backend doesn't have a clear endpoint yet)
            const updated = { ...user, notifications: [] };
            localStorage.setItem("user", JSON.stringify(updated));
            setUser(updated);
        } catch (err) {
            console.error(err);
        }
        setClearing(false);
    };

    return (
        <Layout>
            <div className="page-header-row">
                <div className="page-header" style={{ marginBottom: 0 }}>
                    <h1>🔔 Notifications</h1>
                    <p>Stay updated on your appointments and account status.</p>
                </div>
                {notifications.length > 0 && (
                    <button
                        id="clear-all-notifs"
                        className="btn btn-outline btn-sm"
                        onClick={clearAll}
                        disabled={clearing}
                    >
                        {clearing ? "Clearing…" : "✕ Clear All"}
                    </button>
                )}
            </div>

            <div style={{ marginTop: "24px" }}>
                {notifications.length === 0 ? (
                    <div className="card">
                        <div className="empty-state">
                            <div className="empty-icon">🔔</div>
                            <h3>No notifications</h3>
                            <p>You're all caught up! Notifications will appear here.</p>
                        </div>
                    </div>
                ) : (
                    <div className="notif-list slide-up">
                        {[...notifications].reverse().map((notif, idx) => {
                            const { icon, cls } = getIcon(notif.type);
                            return (
                                <div className="notif-item" key={idx}>
                                    <div className={`notif-icon ${cls}`}>{icon}</div>
                                    <div className="notif-content">
                                        <h4>{notif.message || "Notification"}</h4>
                                        <p>
                                            {notif.type?.replace(/-/g, " ")?.replace(/\b\w/g, (c) =>
                                                c.toUpperCase()
                                            )}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Notifications;
