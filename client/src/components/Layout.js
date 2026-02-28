import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = () => { logout(); navigate("/login"); };

    const notifCount = user?.notifications?.length || 0;
    const getInitials = (name = "") =>
        name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

    const userLinks = [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Book Appointment", path: "/book-appointment" },
        { label: "My Appointments", path: "/appointments" },
        { label: "Apply as Doctor", path: "/apply-doctor" },
        { label: "Notifications", path: "/notifications", badge: notifCount },
    ];

    const doctorLinks = [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Appointments", path: "/doctor-appointments" },
        { label: "Notifications", path: "/notifications", badge: notifCount },
    ];

    const adminLinks = [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Doctors", path: "/admin/doctors" },
        { label: "Users", path: "/admin/users" },
        { label: "Appointments", path: "/admin/appointments" },
        { label: "Notifications", path: "/notifications", badge: notifCount },
    ];

    let links = userLinks;
    if (user?.isAdmin) links = adminLinks;
    else if (user?.isDoctor) links = doctorLinks;

    const isActive = (path) => location.pathname === path;

    const roleLabel = user?.isAdmin ? "Admin" : user?.isDoctor ? "Doctor" : "Patient";
    const roleCls = user?.isAdmin ? "admin" : user?.isDoctor ? "doctor" : "patient";

    return (
        <div className="layout">
            {/* LOGO WATERMARK — fixed behind all content */}
            <div style={{
                position: "fixed", inset: 0,
                backgroundImage: `url(${process.env.PUBLIC_URL}/DocSpot_logo.png)`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
                backgroundSize: "42%",
                opacity: 0.04,
                pointerEvents: "none",
                zIndex: 0,
            }} />

            {/* ── HORIZONTAL NAVBAR ── */}
            <nav className="navbar">

                {/* LEFT: Logo + brand */}
                <div className="navbar-brand">
                    <div className="brand-icon-dot">
                        <img src="/DocSpot_logo.png" alt="DocSpot"
                            style={{ width: "36px", height: "36px", borderRadius: "10px" }} />
                    </div>

                </div>

                {/* CENTER: Horizontal nav links */}
                <div className="navbar-links">
                    {links.map(link => (
                        <button
                            key={link.path}
                            className={`navbar-link ${isActive(link.path) ? "active" : ""}`}
                            onClick={() => navigate(link.path)}
                        >
                            <span className="nav-link-icon">{link.icon}</span>
                            <span className="nav-link-label">{link.label}</span>
                            {link.badge > 0 && (
                                <span className="nav-badge">{link.badge > 9 ? "9+" : link.badge}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* RIGHT: Profile dropdown */}
                <div className="profile-dropdown-wrap" ref={dropdownRef}>
                    <button
                        id="profile-btn"
                        className={`profile-btn ${showUserMenu ? "open" : ""}`}
                        onClick={() => setShowUserMenu(v => !v)}
                    >
                        <div className="profile-avatar">{getInitials(user?.name)}</div>
                        <div className="profile-btn-info">
                            <span className="profile-btn-name">{user?.name?.split(" ")[0]}</span>
                            <span className={`role-pill ${roleCls}`}>{roleLabel}</span>
                        </div>
                        <svg className="chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d={showUserMenu ? "M2 8L6 4L10 8" : "M2 4L6 8L10 4"}
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>

                    {showUserMenu && (
                        <div className="profile-dropdown slide-up">
                            {/* User info header */}
                            <div className="pd-header">
                                <div className="pd-avatar">{getInitials(user?.name)}</div>
                                <div className="pd-info">
                                    <div className="pd-name">{user?.name}</div>
                                    <div className="pd-email">{user?.email}</div>
                                    <span className={`role-pill ${roleCls}`} style={{ marginTop: 4 }}>{roleLabel}</span>
                                </div>
                            </div>
                            <div className="pd-divider" />
                            <button id="logout-btn" className="pd-item danger" onClick={handleLogout}>
                                <span>🚪</span> Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* MAIN CONTENT — no sidebar, full width */}
            <main className="main-content fade-in">
                {children}
            </main>
        </div>
    );
};

export default Layout;
