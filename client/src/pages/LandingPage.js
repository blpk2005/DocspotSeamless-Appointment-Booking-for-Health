import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";

/* ── Public Navbar ── */
const PublicNav = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav style={{
            position: "fixed", top: 0, left: 0, right: 0,
            height: 68, zIndex: 1000,
            background: scrolled
                ? "rgba(255,255,255,0.97)"
                : "rgba(13,27,42,0.55)",
            backdropFilter: "blur(20px)",
            borderBottom: scrolled ? "1px solid #CFE2F3" : "1px solid rgba(255,255,255,0.12)",
            display: "flex", alignItems: "center",
            padding: "0 40px", gap: 24,
            transition: "all 0.3s ease",
            boxShadow: scrolled ? "0 2px 20px rgba(25,118,210,0.1)" : "none",
        }}>
            {/* Brand — always visible */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flex: "0 0 auto" }}>
                <img src="/DocSpot_logo.png" alt="DocSpot" style={{
                    height: 40, objectFit: "contain",
                    background: "white",
                    borderRadius: 10,
                    padding: "3px 6px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }} />
                <div>
                    <div style={{
                        fontFamily: "'Poppins',sans-serif", fontWeight: 800,
                        fontSize: "1.15rem",
                        color: scrolled ? "#1976D2" : "#ffffff",
                        lineHeight: 1, textShadow: scrolled ? "none" : "0 1px 4px rgba(0,0,0,0.3)",
                    }}>DocSpot</div>
                    <div style={{ fontSize: "0.58rem", color: scrolled ? "#607D8B" : "rgba(255,255,255,0.75)" }}>
                        Seamless Appointment Booking for Health
                    </div>
                </div>
            </div>

            <div style={{ flex: 1 }} />

            {/* Nav Links */}
            {[
                { label: "Home", href: "#hero" },
                { label: "Features", href: "#features" },
                { label: "How it Works", href: "#how" },
                { label: "Doctors", href: "#doctors" },
            ].map(l => (
                <a key={l.label} href={l.href} style={{
                    fontSize: "0.875rem", fontWeight: 500,
                    color: scrolled ? "#607D8B" : "rgba(255,255,255,0.88)",
                    textDecoration: "none", transition: "color 0.2s",
                }}
                    onMouseEnter={e => e.target.style.color = scrolled ? "#1976D2" : "#fff"}
                    onMouseLeave={e => e.target.style.color = scrolled ? "#607D8B" : "rgba(255,255,255,0.88)"}
                >{l.label}</a>
            ))}

            <div style={{ display: "flex", gap: 10, marginLeft: 16 }}>
                <button onClick={() => navigate("/login")} style={{
                    padding: "8px 22px", borderRadius: 99,
                    border: `1.5px solid ${scrolled ? "#1976D2" : "rgba(255,255,255,0.7)"}`,
                    background: "transparent", cursor: "pointer",
                    fontWeight: 600, fontSize: "0.875rem",
                    color: scrolled ? "#1976D2" : "white",
                    transition: "all 0.2s", fontFamily: "'Inter',sans-serif",
                }}>Log In</button>
                <button onClick={() => navigate("/register")} style={{
                    padding: "8px 22px", borderRadius: 99, border: "none",
                    background: "linear-gradient(135deg,#1976D2,#0D47A1)",
                    color: "white", cursor: "pointer",
                    fontWeight: 600, fontSize: "0.875rem",
                    boxShadow: "0 4px 14px rgba(25,118,210,0.4)",
                    fontFamily: "'Inter',sans-serif",
                }}>Get Started</button>
            </div>
        </nav>
    );
};

/* ── Stat Card ── */
const StatCard = ({ icon, value, label }) => (
    <div style={{
        textAlign: "center", padding: "28px 20px",
        background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)",
        borderRadius: 16, border: "1px solid rgba(255,255,255,0.2)",
    }}>
        <div style={{ fontSize: "2.2rem", marginBottom: 8 }}>{icon}</div>
        <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "2rem", color: "white" }}>{value}</div>
        <div style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.75)", marginTop: 4 }}>{label}</div>
    </div>
);

/* ── Feature Card ── */
const FeatureCard = ({ icon, title, desc }) => (
    <div style={{
        background: "white", borderRadius: 20, padding: "32px 28px",
        boxShadow: "0 4px 24px rgba(25,118,210,0.08)",
        border: "1px solid #CFE2F3", transition: "all 0.25s",
        cursor: "default",
    }}
        onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow = "0 12px 36px rgba(25,118,210,0.16)";
        }}
        onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 24px rgba(25,118,210,0.08)";
        }}>
        <div style={{
            width: 56, height: 56, borderRadius: 16, marginBottom: 20,
            background: "linear-gradient(135deg,#E3F2FD,#BBDEFB)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem",
        }}>{icon}</div>
        <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "1.05rem", marginBottom: 10, color: "#0D1B2A" }}>{title}</h3>
        <p style={{ fontSize: "0.875rem", color: "#607D8B", lineHeight: 1.7 }}>{desc}</p>
    </div>
);

/* ── Step Card ── */
const StepCard = ({ num, icon, title, desc }) => (
    <div style={{ textAlign: "center", padding: "0 20px" }}>
        <div style={{
            width: 72, height: 72, borderRadius: "50%", margin: "0 auto 20px",
            background: "linear-gradient(135deg,#1976D2,#0D47A1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.8rem", boxShadow: "0 8px 24px rgba(25,118,210,0.3)",
        }}>{icon}</div>
        <div style={{
            display: "inline-block", padding: "2px 12px",
            background: "#E3F2FD", color: "#1976D2", borderRadius: 99,
            fontSize: "0.72rem", fontWeight: 700, marginBottom: 12, letterSpacing: "0.05em",
        }}>STEP {num}</div>
        <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, marginBottom: 10, color: "#0D1B2A" }}>{title}</h3>
        <p style={{ fontSize: "0.875rem", color: "#607D8B", lineHeight: 1.7 }}>{desc}</p>
    </div>
);

/* ── Doctor Card ── */
const PublicDoctorCard = ({ doc, onBook }) => {
    const initials = doc.fullname?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    return (
        <div style={{
            background: "white", borderRadius: 20, padding: "24px",
            boxShadow: "0 4px 24px rgba(25,118,210,0.08)",
            border: "1px solid #CFE2F3", transition: "all 0.25s",
            display: "flex", flexDirection: "column", gap: 16, position: "relative", overflow: "hidden",
        }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 36px rgba(25,118,210,0.16)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 24px rgba(25,118,210,0.08)";
            }}>
            {/* top bar */}
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 4,
                background: "linear-gradient(90deg,#1976D2,#26C6DA)",
            }} />
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 4 }}>
                <div style={{
                    width: 58, height: 58, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg,#E3F2FD,#BBDEFB)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.2rem", fontWeight: 700, color: "#1976D2",
                    border: "3px solid white", boxShadow: "0 0 0 3px #E3F2FD",
                }}>{initials}</div>
                <div>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "1rem", color: "#0D1B2A" }}>
                        Dr. {doc.fullname}
                    </div>
                    <span style={{
                        display: "inline-block", marginTop: 4, padding: "2px 10px",
                        background: "#E3F2FD", color: "#1976D2",
                        borderRadius: 99, fontSize: "0.72rem", fontWeight: 600,
                    }}>{doc.specialization}</span>
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                    { icon: "📍", val: doc.address },
                    { icon: "⏳", val: `${doc.experience} yrs experience` },
                    { icon: "🕐", val: doc.timings?.[0] || "Flexible timings" },
                ].map(m => m.val && (
                    <div key={m.icon} style={{ display: "flex", gap: 8, fontSize: "0.82rem", color: "#607D8B" }}>
                        <span>{m.icon}</span><span>{m.val}</span>
                    </div>
                ))}
            </div>
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                paddingTop: 14, borderTop: "1px solid #CFE2F3",
            }}>
                <div>
                    <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#1976D2" }}>
                        ₹{doc.fees}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#607D8B" }}>per consultation</div>
                </div>
                <button onClick={onBook} style={{
                    padding: "9px 20px", borderRadius: 99, border: "none",
                    background: "linear-gradient(135deg,#1976D2,#0D47A1)",
                    color: "white", fontWeight: 600, fontSize: "0.85rem",
                    cursor: "pointer", boxShadow: "0 4px 14px rgba(25,118,210,0.3)",
                    transition: "all 0.2s",
                }}>Book Now →</button>
            </div>
        </div>
    );
};

/* ══════════════ MAIN LANDING PAGE ══════════════ */
const LandingPage = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        api.get("/doctors/get-all-doctors")
            .then(({ data }) => setDoctors(data.filter(d => d.status === "approved").slice(0, 6)))
            .catch(() => { });
    }, []);

    const sectionStyle = (bg = "#F4F8FB") => ({
        padding: "80px 5vw",
        background: bg,
    });

    const headingStyle = {
        fontFamily: "'Poppins',sans-serif", fontWeight: 800,
        fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
        color: "#0D1B2A", marginBottom: 12, textAlign: "center",
    };

    const subStyle = {
        textAlign: "center", fontSize: "1rem", color: "#607D8B",
        lineHeight: 1.7, marginBottom: 52, maxWidth: 560, margin: "0 auto 52px",
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>
            <PublicNav />

            {/* ── HERO ── */}
            <section id="hero" style={{
                minHeight: "100vh", paddingTop: 68,
                background: "linear-gradient(135deg, #0D47A1 0%, #1976D2 55%, #26C6DA 100%)",
                display: "flex", alignItems: "center",
                padding: "100px 5vw 80px",
                position: "relative", overflow: "hidden",
            }}>
                {/* Decorative blobs */}
                <div style={{
                    position: "absolute", width: 600, height: 600, borderRadius: "50%",
                    background: "rgba(38,198,218,0.12)", top: -150, right: -150, zIndex: 0,
                }} />
                <div style={{
                    position: "absolute", width: 300, height: 300, borderRadius: "50%",
                    background: "rgba(255,255,255,0.05)", bottom: -50, left: "25%", zIndex: 0,
                }} />

                {/* Left: text content */}
                <div style={{ maxWidth: 580, position: "relative", zIndex: 1, flex: "0 0 auto" }}>
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                        borderRadius: 99, padding: "6px 16px", marginBottom: 24,
                        border: "1px solid rgba(255,255,255,0.25)",
                    }}>
                        <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>
                            🏥 Trusted by 10,000+ patients across India
                        </span>
                    </div>

                    <h1 style={{
                        fontFamily: "'Poppins',sans-serif", fontWeight: 900,
                        fontSize: "clamp(2.2rem,5vw,3.5rem)", color: "white",
                        lineHeight: 1.15, marginBottom: 24,
                    }}>
                        Book a Doctor <br />
                        <span style={{ color: "#26C6DA" }}>Appointment</span> in Minutes
                    </h1>

                    <p style={{
                        fontSize: "1.05rem", color: "rgba(255,255,255,0.82)",
                        lineHeight: 1.75, marginBottom: 40, maxWidth: 480,
                    }}>
                        DocSpot connects you with verified healthcare professionals near you.
                        No queues, no phone calls — just instant, seamless booking.
                    </p>

                    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                        <button onClick={() => navigate("/register")} style={{
                            padding: "14px 36px", borderRadius: 99, border: "none",
                            background: "white", color: "#1976D2",
                            fontWeight: 700, fontSize: "1rem", cursor: "pointer",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.2)", fontFamily: "'Inter',sans-serif",
                            transition: "all 0.25s",
                        }}
                            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                            🚀 Get Started Free
                        </button>
                        <button onClick={() => navigate("/login")} style={{
                            padding: "14px 36px", borderRadius: 99,
                            border: "2px solid rgba(255,255,255,0.6)",
                            background: "transparent", color: "white",
                            fontWeight: 600, fontSize: "1rem", cursor: "pointer",
                            fontFamily: "'Inter',sans-serif", transition: "all 0.25s",
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            Log In →
                        </button>
                    </div>
                </div>

                {/* Right: Big logo — no box, maximum size */}
                <div style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative", zIndex: 1, minWidth: 280, padding: "0 16px",
                }}>
                    <img
                        src="/DocSpot_logo.png"
                        alt="DocSpot"
                        style={{
                            width: "100%",
                            maxWidth: 480,
                            height: "auto",
                            objectFit: "contain",
                            display: "block",
                            filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.3))",
                        }}
                    />
                </div>

            </section>

            {/* ── STATS ── */}
            <section style={{
                background: "linear-gradient(135deg,#0D47A1,#1976D2)",
                padding: "48px 5vw",
            }}>
                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
                    gap: 20, maxWidth: 1100, margin: "0 auto",
                }}>
                    <StatCard icon="👨‍⚕️" value="500+" label="Verified Doctors" />
                    <StatCard icon="👥" value="10K+" label="Happy Patients" />
                    <StatCard icon="📅" value="25K+" label="Appointments Booked" />
                    <StatCard icon="⭐" value="4.9" label="Average Rating" />
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section id="how" style={sectionStyle("#ffffff")}>
                <h2 style={headingStyle}>How It Works</h2>
                <p style={subStyle}>Three simple steps to your appointment.</p>
                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
                    gap: 40, maxWidth: 900, margin: "0 auto",
                }}>
                    <StepCard num={1} icon="✍️" title="Create Your Account"
                        desc="Sign up for free in under a minute. No credit card required." />
                    <StepCard num={2} icon="🔍" title="Browse & Filter Doctors"
                        desc="Search by specialty, location, experience and fees. Find your perfect match." />
                    <StepCard num={3} icon="📅" title="Book a Slot"
                        desc="Pick a date, upload documents if needed, and confirm. Done!" />
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section id="features" style={sectionStyle("#F4F8FB")}>
                <h2 style={headingStyle}>Why Choose DocSpot?</h2>
                <p style={subStyle}>Everything you need for a seamless healthcare experience.</p>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
                    gap: 24, maxWidth: 1100, margin: "0 auto",
                }}>
                    <FeatureCard icon="✅" title="Verified Doctors"
                        desc="Every doctor on our platform is reviewed and approved by our admin team before going live." />
                    <FeatureCard icon="⚡" title="Instant Booking"
                        desc="Book appointments in real-time without phone calls or waiting on hold." />
                    <FeatureCard icon="🔔" title="Smart Notifications"
                        desc="Get notified when your appointment is confirmed, rescheduled, or completed." />
                    <FeatureCard icon="📁" title="Upload Documents"
                        desc="Attach medical records or insurance documents securely when booking." />
                    <FeatureCard icon="🔒" title="Secure & Private"
                        desc="Your health data is encrypted and stored safely. We never share your information." />
                    <FeatureCard icon="🩺" title="Apply as Doctor"
                        desc="Healthcare professionals can register and manage their appointment schedules easily." />
                </div>
            </section>

            {/* ── DOCTORS ── */}
            <section id="doctors" style={sectionStyle("#ffffff")}>
                <h2 style={headingStyle}>Meet Our Doctors</h2>
                <p style={subStyle}>Approved specialists ready to serve you.</p>

                {doctors.length === 0 ? (
                    <div style={{ textAlign: "center", color: "#607D8B", padding: "40px 0" }}>
                        <div style={{ fontSize: "3rem", marginBottom: 12, opacity: 0.4 }}>🩺</div>
                        <p>Doctors will appear here once approved. <Link to="/login" style={{ color: "#1976D2", fontWeight: 600 }}>Login to see all →</Link></p>
                    </div>
                ) : (
                    <>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
                            gap: 24, maxWidth: 1100, margin: "0 auto 40px",
                        }}>
                            {doctors.map(doc => (
                                <PublicDoctorCard key={doc._id} doc={doc}
                                    onBook={() => navigate("/login")} />
                            ))}
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <button onClick={() => navigate("/register")} style={{
                                padding: "12px 32px", borderRadius: 99, border: "none",
                                background: "linear-gradient(135deg,#1976D2,#0D47A1)",
                                color: "white", fontWeight: 600, fontSize: "0.95rem",
                                cursor: "pointer", boxShadow: "0 4px 16px rgba(25,118,210,0.3)",
                            }}>View All Doctors & Book Now →</button>
                        </div>
                    </>
                )}
            </section>

            {/* ── CTA BANNER ── */}
            <section style={{
                background: "linear-gradient(135deg,#0D47A1,#1976D2,#26C6DA)",
                padding: "80px 5vw", textAlign: "center",
                position: "relative", overflow: "hidden",
            }}>
                <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: `url(${process.env.PUBLIC_URL}/DocSpot_logo.png)`,
                    backgroundRepeat: "no-repeat", backgroundPosition: "center",
                    backgroundSize: "30%", opacity: 0.06, pointerEvents: "none",
                }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                    <h2 style={{
                        fontFamily: "'Poppins',sans-serif", fontWeight: 900,
                        fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "white", marginBottom: 16,
                    }}>
                        Ready to Take Control of Your Health?
                    </h2>
                    <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.8)", marginBottom: 36 }}>
                        Join DocSpot today — it's free, fast, and built for you.
                    </p>
                    <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                        <button onClick={() => navigate("/register")} style={{
                            padding: "14px 40px", borderRadius: 99, border: "none",
                            background: "white", color: "#1976D2",
                            fontWeight: 700, fontSize: "1rem", cursor: "pointer",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                        }}>🚀 Create Free Account</button>
                        <button onClick={() => navigate("/login")} style={{
                            padding: "14px 40px", borderRadius: 99,
                            border: "2px solid rgba(255,255,255,0.6)",
                            background: "transparent", color: "white",
                            fontWeight: 600, fontSize: "1rem", cursor: "pointer",
                        }}>Already have an account?</button>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{
                background: "#0D47A1", color: "rgba(255,255,255,0.7)",
                padding: "32px 5vw", textAlign: "center",
            }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
                    <img src="/DocSpot_logo.png" alt="DocSpot"
                        style={{ height: 32, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.85 }} />
                    <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, color: "white", fontSize: "1rem" }}>DocSpot</span>
                </div>
                <p style={{ fontSize: "0.8rem", marginBottom: 12 }}>
                    Seamless Appointment Booking for Health
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: 24, fontSize: "0.82rem" }}>
                    <Link to="/login" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>Login</Link>
                    <Link to="/register" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>Register</Link>
                    <Link to="/forgot-password" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>Forgot Password</Link>
                </div>
                <p style={{ fontSize: "0.75rem", marginTop: 20, opacity: 0.5 }}>
                    © 2026 DocSpot. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default LandingPage;
