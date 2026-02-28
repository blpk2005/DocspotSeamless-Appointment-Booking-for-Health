import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false, doctorOnly = false }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="spinner-overlay">
                <div className="spinner" />
            </div>
        );
    }

    if (!user) return <Navigate to="/" replace />;
    if (adminOnly && !user.isAdmin) return <Navigate to="/dashboard" replace />;
    if (doctorOnly && !user.isDoctor && !user.isAdmin) return <Navigate to="/dashboard" replace />;

    return children;
};

export default ProtectedRoute;
