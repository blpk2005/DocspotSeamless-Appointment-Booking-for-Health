import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specFilter, setSpecFilter] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get("/doctors/get-all-doctors");
      setDoctors(data.filter((d) => d.status === "approved"));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const specializations = [
    ...new Set(doctors.map((d) => d.specialization).filter(Boolean)),
  ];

  const filtered = doctors.filter((d) => {
    const matchSearch =
      !search ||
      d.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(search.toLowerCase()) ||
      d.address?.toLowerCase().includes(search.toLowerCase());
    const matchSpec = !specFilter || d.specialization === specFilter;
    return matchSearch && matchSpec;
  });

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <Layout>
      {/* HERO */}
      <div className="hero">
        <div className="hero-content">
          <h1>
            Find Your <span>Perfect Doctor</span>
          </h1>
          <p>
            Browse from our network of{" "}
            <strong>{doctors.length}+ verified doctors</strong>. Book an
            appointment instantly and get the care you deserve.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/book-appointment")}
            >
              📅 Book Appointment
            </button>
            <button
              className="btn"
              style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
              onClick={() => navigate("/appointments")}
            >
              📋 My Appointments
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">👨‍⚕️</div>
          <div className="stat-info">
            <h3>{doctors.length}</h3>
            <p>Verified Doctors</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">📅</div>
          <div className="stat-info">
            <h3>{specializations.length}</h3>
            <p>Specialties Available</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">🏥</div>
          <div className="stat-info">
            <h3>24/7</h3>
            <p>Online Booking</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">⭐</div>
          <div className="stat-info">
            <h3>4.9★</h3>
            <p>Average Rating</p>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="page-header-row">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Available Doctors</h1>
        </div>
      </div>

      <div className="search-bar" style={{ marginTop: "16px" }}>
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            id="doctor-search"
            className="search-input"
            type="text"
            placeholder="Search by name, specialty, or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          id="spec-filter"
          className="filter-select"
          value={specFilter}
          onChange={(e) => setSpecFilter(e.target.value)}
        >
          <option value="">All Specialties</option>
          {specializations.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {(search || specFilter) && (
          <button
            className="btn btn-outline btn-sm"
            onClick={() => {
              setSearch("");
              setSpecFilter("");
            }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "60px",
          }}
        >
          <div className="spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">👨‍⚕️</div>
            <h3>No doctors found</h3>
            <p>
              {search || specFilter
                ? "Try adjusting your search filters."
                : "No approved doctors yet. Check back soon!"}
            </p>
          </div>
        </div>
      ) : (
        <div className="doctors-grid">
          {filtered.map((doctor) => (
            <div className="doctor-card fade-in" key={doctor._id}>
              <div className="doctor-header">
                <div className="doctor-avatar">{getInitials(doctor.fullname)}</div>
                <div className="doctor-info">
                  <h3>Dr. {doctor.fullname}</h3>
                  <div className="spec-badge">
                    🩺 {doctor.specialization || "General"}
                  </div>
                </div>
              </div>

              <div className="doctor-meta">
                {doctor.experience && (
                  <div className="doctor-meta-item">
                    <span className="meta-icon">🏅</span>
                    {doctor.experience} years experience
                  </div>
                )}
                {doctor.address && (
                  <div className="doctor-meta-item">
                    <span className="meta-icon">📍</span>
                    {doctor.address}
                  </div>
                )}
                {doctor.phone && (
                  <div className="doctor-meta-item">
                    <span className="meta-icon">📞</span>
                    {doctor.phone}
                  </div>
                )}
                {doctor.timings && doctor.timings.length > 0 && (
                  <div className="doctor-meta-item">
                    <span className="meta-icon">🕐</span>
                    <div className="timing-chips">
                      {Array.isArray(doctor.timings)
                        ? doctor.timings.map((t, i) => (
                          <span key={i} className="timing-chip">{t}</span>
                        ))
                        : <span className="timing-chip">{doctor.timings}</span>
                      }
                    </div>
                  </div>
                )}
              </div>

              <div className="doctor-fees">
                <div>
                  <div className="fee-value">₹{doctor.fees}</div>
                  <div className="fee-label">Consultation Fee</div>
                </div>
                {!user?.isAdmin && !user?.isDoctor && (
                  <button
                    id={`book-${doctor._id}`}
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      navigate("/book-appointment", {
                        state: { doctor },
                      })
                    }
                  >
                    Book Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Home;
