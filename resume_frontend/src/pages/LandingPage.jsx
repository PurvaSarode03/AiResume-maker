
import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import emailjs from "@emailjs/browser";

const useIsMobile = () => {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
};

const LandingPage = () => {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [feedback, setFeedback] = useState({ name: "", email: "", message: "" });
  const [feedbackStatus, setFeedbackStatus] = useState("idle"); // idle | sending | sent | error
  const mobile = useIsMobile();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => { if (!mobile) setMenuOpen(false); }, [mobile]);

  const handleFeedbackSubmit = async () => {
    if (!feedback.name || !feedback.email || !feedback.message) return;
    setFeedbackStatus("sending");
    try {
      await emailjs.send(
        "YOUR_SERVICE_ID",     // 🔁 replace with your EmailJS Service ID
        "YOUR_TEMPLATE_ID",    // 🔁 replace with your EmailJS Template ID
        {
          from_name:    feedback.name,
          from_email:   feedback.email,
          message:      feedback.message,
        },
        "YOUR_PUBLIC_KEY"      // 🔁 replace with your EmailJS Public Key
      );
      setFeedbackStatus("sent");
      setFeedback({ name: "", email: "", message: "" });
    } catch {
      setFeedbackStatus("error");
    }
  };

  const t = {
    bg:         dark ? "#08080f"                : "#fafafa",
    surface:    dark ? "#0f0f18"                : "#f2f2f7",
    card:       dark ? "#13131e"                : "#ffffff",
    border:     dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
    text:       dark ? "#eeeef5"                : "#0c0c14",
    muted:      dark ? "rgba(238,238,245,0.42)" : "rgba(12,12,20,0.42)",
    accent:     "#0f62fe",
    accentAlt:  "#6929c4",
    accentSoft: dark ? "rgba(15,98,254,0.14)"   : "rgba(15,98,254,0.07)",
  };

  const px = mobile ? "1.2rem" : "5.5%";

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: 9,
    border: `1px solid ${t.border}`,
    background: t.surface,
    color: t.text,
    fontSize: "0.9rem",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    outline: "none",
    transition: "border-color 0.18s",
  };

  return (
    <div style={{
      background: t.bg, color: t.text,
      minHeight: "100vh",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      transition: "background 0.3s, color 0.3s",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .a1 { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
        .a2 { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
        .a3 { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
        .a4 { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.35s both; }
        .a5 { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.45s both; }
        .menu-anim { animation: slideDown 0.22s cubic-bezier(0.22,1,0.36,1) both; }
        .grad-text {
          background: linear-gradient(125deg, #0f62fe 0%, #6929c4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .btn {
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600; border: none; cursor: pointer;
          text-decoration: none; letter-spacing: 0.005em;
          transition: transform 0.18s cubic-bezier(0.22,1,0.36,1), box-shadow 0.18s;
          white-space: nowrap;
        }
        .btn:hover { transform: translateY(-2px); }
        .card-lift {
          transition: transform 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s;
        }
        .card-lift:hover { transform: translateY(-5px); }
        .nav-link {
          font-size: 0.9rem; font-weight: 500; text-decoration: none;
          opacity: 0.55; transition: opacity 0.18s; color: inherit;
          background: none; border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .nav-link:hover { opacity: 1; }
        .toggle {
          width: 38px; height: 38px; border-radius: 8px; border: 1px solid;
          background: transparent; display: flex; align-items: center;
          justify-content: center; cursor: pointer; font-size: 0.95rem;
          transition: transform 0.18s; flex-shrink: 0;
        }
        .toggle:hover { transform: scale(1.1) rotate(12deg); }
        .hamburger {
          width: 38px; height: 38px; border-radius: 8px; border: 1px solid;
          background: transparent; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 5px;
          cursor: pointer; transition: opacity 0.18s; flex-shrink: 0;
        }
        .hamburger:hover { opacity: 0.7; }
        .section-label {
          font-size: 0.72rem; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: #0f62fe; margin-bottom: 0.6rem;
        }
        .feedback-input:focus { border-color: #0f62fe !important; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 200,
        backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
        background: dark ? "rgba(8,8,15,0.88)" : "rgba(250,250,250,0.92)",
        borderBottom: `1px solid ${t.border}`,
      }}>
        <div style={{
          height: 60, display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: `0 ${px}`,
        }}>
          <div style={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.02em" }}>
            Resume<span className="grad-text">AI</span>
          </div>

          {/* ── FIX 1: Mobile navbar — only theme toggle, no hamburger clutter ── */}
          {!mobile ? (
            <div style={{ display: "flex", gap: "0.55rem", alignItems: "center" }}>
              <button onClick={() => setDark(!dark)} className="toggle" style={{ borderColor: t.border, color: t.text }}>
                {dark ? "☀️" : "🌙"}
              </button>
              <Link to="/generate-resume" className="btn" style={{
                background: "linear-gradient(125deg,#0f62fe,#6929c4)", color: "#fff",
                padding: "0.55rem 1.2rem", borderRadius: 8, fontSize: "0.875rem",
                boxShadow: "0 4px 18px rgba(15,98,254,0.32)",
              }}>Get Started</Link>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <button onClick={() => setDark(!dark)} className="toggle" style={{ borderColor: t.border, color: t.text }}>
                {dark ? "☀️" : "🌙"}
              </button>
              <button
                className="hamburger"
                onClick={() => setMenuOpen(o => !o)}
                style={{ borderColor: t.border }}
              >
                {menuOpen
                  ? <span style={{ fontSize: "1.1rem", color: t.text, lineHeight: 1 }}>✕</span>
                  : <>
                      <div style={{ width: 18, height: 2, borderRadius: 2, background: t.text }} />
                      <div style={{ width: 18, height: 2, borderRadius: 2, background: t.text }} />
                      <div style={{ width: 14, height: 2, borderRadius: 2, background: t.text }} />
                    </>
                }
              </button>
            </div>
          )}
        </div>

        {mobile && menuOpen && (
          <div className="menu-anim" style={{
            background: dark ? "rgba(8,8,15,0.97)" : "rgba(250,250,250,0.97)",
            borderTop: `1px solid ${t.border}`,
            padding: "1rem 1.2rem 1.5rem",
            display: "flex", flexDirection: "column", gap: "0.2rem",
          }}>
            <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.5rem" }}>
              <Link to="/generate-resume" className="btn" onClick={() => setMenuOpen(false)} style={{
                flex: 1, justifyContent: "center",
                background: "linear-gradient(125deg,#0f62fe,#6929c4)", color: "#fff",
                padding: "0.7rem", borderRadius: 9, fontSize: "0.9rem",
                boxShadow: "0 4px 14px rgba(15,98,254,0.3)",
              }}>Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: "calc(100vh - 60px)",
        display: "flex",
        flexDirection: mobile ? "column" : "row",
        alignItems: "center",
        justifyContent: mobile ? "flex-start" : "center",
        padding: mobile ? "2.5rem 1.2rem 3rem" : "3rem 5.5%",
        gap: mobile ? "2.5rem" : "3.5rem",
        maxWidth: 1200,
        margin: "0 auto",
      }}>
        <div style={{ flex: mobile ? "none" : "0 0 52%", maxWidth: mobile ? "100%" : 540, width: "100%" }}>
          <div className="a1" style={{
            display: "inline-flex", alignItems: "center", gap: "0.45rem",
            background: t.accentSoft, border: "1px solid rgba(15,98,254,0.22)",
            borderRadius: 6, padding: "0.28rem 0.75rem",
            fontSize: "0.7rem", fontWeight: 700, color: "#0f62fe",
            letterSpacing: "0.08em", textTransform: "uppercase",
            marginBottom: mobile ? "1rem" : "1.4rem",
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#0f62fe", display: "inline-block" }} />
            AI Resume Builder
          </div>

          <h1 className="a2" style={{
            fontSize: mobile ? "2.4rem" : "clamp(2.6rem, 4.8vw, 4rem)",
            fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em",
            marginBottom: mobile ? "1rem" : "1.3rem", color: t.text,
          }}>
            Build a Resume<br />
            That Gets You{" "}
            <span className="grad-text">Hired</span>
          </h1>

          <p className="a3" style={{
            fontSize: mobile ? "0.95rem" : "1rem", lineHeight: 1.75,
            color: t.muted, marginBottom: mobile ? "1.6rem" : "2rem",
            fontWeight: 400, maxWidth: 440,
          }}>
            Describe your background in plain language — our AI writes,
            structures, and polishes a professional resume ready to send in minutes.
          </p>

          <div className="a4" style={{
            display: "flex", gap: "0.7rem",
            flexDirection: mobile ? "column" : "row",
            marginBottom: mobile ? "2rem" : "2.6rem",
          }}>
            <Link to="/generate-resume" className="btn" style={{
              background: "linear-gradient(125deg,#0f62fe,#6929c4)", color: "#fff",
              fontSize: "0.92rem", padding: "0.82rem 1.7rem", borderRadius: 9,
              boxShadow: "0 6px 22px rgba(15,98,254,0.3)",
              justifyContent: mobile ? "center" : "flex-start",
            }}>Create My Resume →</Link>
          </div>

          {/* ── FIX 2: Removed the 3 border-top lines on mobile ── */}
          <div className="a5" style={{
            display: "flex", gap: mobile ? "1.5rem" : "2.2rem",
            paddingTop: mobile ? "0" : "1.6rem",
            borderTop: mobile ? "none" : `1px solid ${t.border}`,
            flexWrap: "wrap",
          }}>
            {[["ATS-friendly","Resumes built"],["92%","Interview rate"],["< 3 min","To generate"]].map(([n,l]) => (
              <div key={l}>
                <div style={{
                  fontSize: mobile ? "1.2rem" : "1.4rem", fontWeight: 800, letterSpacing: "-0.02em",
                  background: "linear-gradient(125deg,#0f62fe,#6929c4)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>{n}</div>
                <div style={{ fontSize: "0.74rem", color: t.muted, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Resume preview card */}
        <div className="a3" style={{
          flex: 1, display: "flex", justifyContent: "center", alignItems: "center",
          width: "100%",
        }}>
          <div style={{
            width: "100%", maxWidth: mobile ? 340 : 370,
            background: t.card, border: `1px solid ${t.border}`,
            borderRadius: 18, padding: mobile ? "1.4rem" : "1.8rem",
            boxShadow: dark
              ? "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)"
              : "0 32px 80px rgba(15,98,254,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.3rem" }}>
              <div style={{ display: "flex", gap: "0.35rem" }}>
                {["#ff5f57","#febc2e","#28c840"].map(c => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                ))}
              </div>
              <div style={{
                fontSize: "0.66rem", fontWeight: 600, color: "#0f62fe",
                background: t.accentSoft, padding: "0.2rem 0.55rem",
                borderRadius: 5, letterSpacing: "0.05em",
              }}>PREVIEW</div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1.3rem" }}>
              <div style={{
                width: 42, height: 42, borderRadius: 11, flexShrink: 0,
                background: "linear-gradient(125deg,rgba(15,98,254,0.15),rgba(105,41,196,0.15))",
                border: "1px solid rgba(15,98,254,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem",
              }}>👤</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.92rem", color: t.text }}>Purva Sarode</div>
                <div style={{ fontSize: "0.74rem", color: t.muted }}>Full stack developer</div>
              </div>
            </div>

            <div style={{ height: 1, background: t.border, marginBottom: "1.1rem" }} />

            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.63rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0f62fe", marginBottom: "0.45rem" }}>Skills</div>
              <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                {["Spring boot","React","REST API"].map(tag => (
                  <span key={tag} style={{
                    fontSize: "0.7rem", padding: "0.2rem 0.55rem", borderRadius: 5,
                    background: t.accentSoft, color: "#0f62fe", fontWeight: 600,
                    border: "1px solid rgba(15,98,254,0.15)",
                  }}>{tag}</span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.63rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6929c4", marginBottom: "0.45rem" }}>Experience</div>
              <div style={{ height: 7, borderRadius: 4, background: t.border, marginBottom: 5 }} />
              <div style={{ height: 7, borderRadius: 4, background: t.border, width: "72%" }} />
            </div>

            <div style={{ marginBottom: "1.2rem" }}>
              <div style={{ fontSize: "0.63rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6929c4", marginBottom: "0.45rem" }}>Education</div>
              <div style={{ height: 7, borderRadius: 4, background: t.border, marginBottom: 5 }} />
              <div style={{ height: 7, borderRadius: 4, background: t.border, width: "55%" }} />
            </div>

            <div style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.5rem 0.8rem", borderRadius: 8,
              background: "linear-gradient(125deg,rgba(15,98,254,0.1),rgba(105,41,196,0.1))",
              border: "1px solid rgba(15,98,254,0.18)",
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: 5,
                background: "linear-gradient(125deg,#0f62fe,#6929c4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.6rem", color: "#fff", fontWeight: 800, flexShrink: 0,
              }}>✦</div>
              <span style={{ fontSize: "0.73rem", fontWeight: 600, color: "#0f62fe" }}>Generated by AI · 2 min</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ background: t.surface, padding: mobile ? "3.5rem 1.2rem" : "5rem 5.5%" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: "2.5rem" }}>
            <div className="section-label">Features</div>
            <h2 style={{
              fontSize: mobile ? "1.7rem" : "clamp(1.75rem,2.8vw,2.4rem)",
              fontWeight: 800, letterSpacing: "-0.025em", color: t.text,
            }}>Everything you need</h2>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "repeat(auto-fit,minmax(270px,1fr))",
            gap: "1rem",
          }}>
            {[
              { icon: "⚡", title: "AI Content Writing", desc: "Reads your raw input and generates ATS-optimised, impact-driven bullet points tailored to your experience.", i: 0 },
              { icon: "🎨", title: "Clean Templates", desc: "Recruiter-approved layouts — minimal, modern, or executive. All export-ready as PDF.", i: 1 },
              { icon: "🎯", title: "Job-Targeted", desc: "Paste any job description. The AI rewrites your resume to match keywords and expectations automatically.", i: 2 },
            ].map(({ icon, title, desc, i }) => (
              <div key={title} className="card-lift" style={{
                background: t.card, border: `1px solid ${t.border}`,
                borderRadius: 14, padding: "1.6rem",
                boxShadow: dark ? "0 2px 16px rgba(0,0,0,0.3)" : "0 2px 16px rgba(0,0,0,0.04)",
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, marginBottom: "1rem",
                  background: i === 0
                    ? "linear-gradient(125deg,rgba(15,98,254,0.15),rgba(15,98,254,0.05))"
                    : i === 1
                    ? "linear-gradient(125deg,rgba(105,41,196,0.15),rgba(105,41,196,0.05))"
                    : "linear-gradient(125deg,rgba(15,98,254,0.1),rgba(105,41,196,0.1))",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem",
                  border: i === 0 ? "1px solid rgba(15,98,254,0.18)" : i === 1 ? "1px solid rgba(105,41,196,0.18)" : "1px solid rgba(15,98,254,0.12)",
                }}>{icon}</div>
                <h3 style={{ fontSize: "0.98rem", fontWeight: 700, marginBottom: "0.5rem", color: t.text }}>{title}</h3>
                <p style={{ fontSize: "0.855rem", lineHeight: 1.7, color: t.muted }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: mobile ? "3.5rem 1.2rem" : "5rem 5.5%" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: "2.5rem" }}>
            <div className="section-label">Testimonials</div>
            <h2 style={{
              fontSize: mobile ? "1.7rem" : "clamp(1.75rem,2.8vw,2.4rem)",
              fontWeight: 800, letterSpacing: "-0.025em", color: t.text,
            }}>What users say</h2>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "repeat(auto-fit,minmax(270px,1fr))",
            gap: "1rem",
          }}>
            {[
              { q: "Got three interview calls within a week. The resume it produced was better than what I spent hours writing myself.", name: "Rohit Thackeray", role: "Software Engineer", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
              { q: "Clean, professional output. I was skeptical but the AI captured my experience accurately. Highly recommend.", name: "Jane Smith", role: "Marketing Manager", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
            ].map(({ q, name, role, avatar }) => (
              <div key={name} className="card-lift" style={{
                background: t.card, border: `1px solid ${t.border}`,
                borderRadius: 14, padding: "1.6rem",
                boxShadow: dark ? "0 2px 16px rgba(0,0,0,0.3)" : "0 2px 16px rgba(0,0,0,0.04)",
              }}>
                <div style={{ color: "#f59e0b", fontSize: "0.8rem", marginBottom: "0.85rem", letterSpacing: 1 }}>★★★★★</div>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.75, color: t.muted, marginBottom: "1.3rem" }}>"{q}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                  <img src={avatar} alt={name} style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.875rem", color: t.text }}>{name}</div>
                    <div style={{ fontSize: "0.76rem", color: t.muted }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEEDBACK FORM ── */}
      <section style={{ background: t.surface, padding: mobile ? "3.5rem 1.2rem" : "5rem 5.5%" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <div className="section-label">Feedback</div>
            <h2 style={{
              fontSize: mobile ? "1.7rem" : "clamp(1.75rem,2.8vw,2.4rem)",
              fontWeight: 800, letterSpacing: "-0.025em", color: t.text, marginBottom: "0.5rem",
            }}>Share your thoughts</h2>
            <p style={{ fontSize: "0.9rem", color: t.muted }}>Help us improve ResumeAI — we read every message.</p>
          </div>

          <div style={{
            background: t.card, border: `1px solid ${t.border}`,
            borderRadius: 16, padding: mobile ? "1.5rem" : "2rem",
            boxShadow: dark ? "0 2px 16px rgba(0,0,0,0.3)" : "0 2px 16px rgba(0,0,0,0.04)",
            display: "flex", flexDirection: "column", gap: "1rem",
          }}>
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: t.muted, display: "block", marginBottom: "0.4rem" }}>Name</label>
                <input
                  className="feedback-input"
                  style={inputStyle}
                  placeholder="Your name"
                  value={feedback.name}
                  onChange={e => setFeedback(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: t.muted, display: "block", marginBottom: "0.4rem" }}>Email</label>
                <input
                  className="feedback-input"
                  style={inputStyle}
                  placeholder="your@email.com"
                  type="email"
                  value={feedback.email}
                  onChange={e => setFeedback(f => ({ ...f, email: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: t.muted, display: "block", marginBottom: "0.4rem" }}>Message</label>
              <textarea
                className="feedback-input"
                style={{ ...inputStyle, minHeight: 120, resize: "vertical" }}
                placeholder="Tell us what you think, what to improve, or report a bug..."
                value={feedback.message}
                onChange={e => setFeedback(f => ({ ...f, message: e.target.value }))}
              />
            </div>

            <button
              onClick={handleFeedbackSubmit}
              disabled={feedbackStatus === "sending" || feedbackStatus === "sent"}
              className="btn"
              style={{
                background: feedbackStatus === "sent"
                  ? "linear-gradient(125deg,#10b981,#059669)"
                  : "linear-gradient(125deg,#0f62fe,#6929c4)",
                color: "#fff",
                padding: "0.82rem 1.7rem", borderRadius: 9,
                fontSize: "0.92rem", justifyContent: "center",
                opacity: feedbackStatus === "sending" ? 0.7 : 1,
                boxShadow: "0 6px 22px rgba(15,98,254,0.3)",
              }}
            >
              {feedbackStatus === "sending" ? "Sending..." :
               feedbackStatus === "sent"    ? "✓ Sent! Thank you" :
               feedbackStatus === "error"   ? "Failed — try again" :
               "Send Feedback"}
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: mobile ? "2rem 1.2rem 4rem" : "3.5rem 5.5% 5.5rem" }}>
        <div style={{
          maxWidth: 740, margin: "0 auto",
          background: "linear-gradient(125deg,#0f62fe,#6929c4)",
          borderRadius: 20, padding: mobile ? "2.5rem 1.5rem" : "3.8rem 3rem",
          textAlign: "center",
          boxShadow: "0 24px 64px rgba(15,98,254,0.32)",
        }}>
          <h2 style={{
            fontSize: mobile ? "1.7rem" : "clamp(1.7rem,3.2vw,2.6rem)",
            fontWeight: 800, color: "#fff", marginBottom: "0.8rem", letterSpacing: "-0.025em",
          }}>Ready to get hired?</h2>
          <p style={{ fontSize: "0.93rem", color: "rgba(255,255,255,0.72)", marginBottom: "1.7rem", lineHeight: 1.7 }}>
            Join 50,000+ professionals who built their careers with ResumeAI.
          </p>
          <Link to="/generate-resume" className="btn" style={{
            background: "#fff", color: "#0f62fe", fontWeight: 700,
            fontSize: "0.92rem", padding: "0.82rem 1.9rem", borderRadius: 9,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            display: "inline-flex",
          }}>
            Create My Resume — Free
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${t.border}`, padding: "1.5rem", textAlign: "center" }}>
        <span style={{ fontSize: "0.82rem", color: t.muted }}>
          © 2025 Resume<span style={{ fontWeight: 700, color: t.text }}>AI</span>
        </span>
      </footer>
    </div>
  );
};

export default LandingPage;
