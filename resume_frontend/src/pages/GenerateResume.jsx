import React, { useState } from "react";
import ResumePreview from "./ResumePreview";
import { generateResume } from "../api/ResumeService";
import toast from "react-hot-toast";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 8);

const SUGGESTIONS = [
  "5+ years in frontend dev, React, TypeScript, led a team of 4",
  "Recent MBA grad, internship at KPMG, strong in Excel & data analysis",
  "Nurse with 3 years ICU experience, shifting to health-tech",
  "Freelance graphic designer, 6 years, brand identity & Figma specialist",
];
const CHAR_LIMIT = 1500;

const SKILL_KEYS = ["programmingLanguages","frameworks","databases","cloud","devOpsTools","otherSkills"];
const SKILL_LABELS = { programmingLanguages:"Programming Languages", frameworks:"Frameworks", databases:"Databases", cloud:"Cloud", devOpsTools:"DevOps Tools", otherSkills:"Other Skills" };
const SKILL_ICONS  = { programmingLanguages:"💻", frameworks:"🧩", databases:"🗄️", cloud:"☁️", devOpsTools:"🔧", otherSkills:"✨" };

const initForm = (data) => ({
  personalInformation: { ...data.personalInformation },
  summary: data.summary || "",
  skills: {
    programmingLanguages: [...(data.skills?.programmingLanguages || [])],
    frameworks:           [...(data.skills?.frameworks           || [])],
    databases:            [...(data.skills?.databases            || [])],
    cloud:                [...(data.skills?.cloud                || [])],
    devOpsTools:          [...(data.skills?.devOpsTools          || [])],
    otherSkills:          [...(data.skills?.otherSkills          || [])],
  },
  experience:     (data.experience     || []).map(e => ({ ...e, _id: uid() })),
  education:      (data.education      || []).map(e => ({ ...e, _id: uid() })),
  certifications: (data.certifications || []).map(e => ({ ...e, _id: uid() })),
  projects:       (data.projects       || []).map(e => ({ ...e, _id: uid(), technologiesUsed:[...(e.technologiesUsed||[])] })),
  achievements:   (data.achievements   || []).map(e => ({ ...e, _id: uid() })),
  languages:      (data.languages      || []).map(e => ({ ...e, _id: uid() })),
  interests:      (data.interests      || []).map(e => ({ ...e, _id: uid() })),
});

// ─────────────────────────────────────────────────────────────────────────────
// SHARED STYLES (injected once)
// ─────────────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  :root { --navbar-bg: rgba(255,255,255,0.88); }
  [data-theme="dark"] { --navbar-bg: rgba(10,10,15,0.88); }

  .grad-text {
    background: linear-gradient(125deg,#0f62fe,#6929c4);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .grad-btn {
    background: linear-gradient(125deg,#0f62fe,#6929c4) !important;
    border: none !important; color: #fff !important;
    font-family: 'Plus Jakarta Sans', sans-serif !important; font-weight: 700 !important;
    transition: transform 0.18s cubic-bezier(0.22,1,0.36,1), box-shadow 0.18s !important;
  }
  .grad-btn:hover:not(:disabled) { transform: translateY(-2px) !important; box-shadow: 0 8px 28px rgba(15,98,254,0.38) !important; }
  .grad-btn:disabled { opacity: 0.55 !important; cursor: not-allowed !important; }

  .desc-textarea {
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    font-size: 0.95rem !important; line-height: 1.75 !important; resize: none !important;
  }
  .desc-textarea:focus { outline: none !important; border-color: #0f62fe !important; box-shadow: 0 0 0 3px rgba(15,98,254,0.13) !important; }

  .chip {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.77rem; font-weight: 500;
    padding: 0.32rem 0.7rem; border-radius: 20px;
    cursor: pointer; transition: all 0.18s; white-space: nowrap;
    border: 1px solid rgba(15,98,254,0.2); background: transparent; color: inherit;
  }
  .chip:hover { background: rgba(15,98,254,0.09) !important; border-color: #0f62fe !important; }

  input:focus, textarea:focus, select:focus {
    outline: none !important; border-color: #0f62fe !important;
    box-shadow: 0 0 0 3px rgba(15,98,254,0.12) !important;
  }
  input:-webkit-autofill { -webkit-box-shadow: 0 0 0 1000px var(--b1,#fff) inset !important; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes spin     { to { transform:rotate(360deg); } }
  @keyframes popIn    { 0%{transform:scale(0.88);opacity:0} 70%{transform:scale(1.04)} 100%{transform:scale(1);opacity:1} }
  @keyframes slideUp  { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }

  .a1 { animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
  .a2 { animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.16s both; }
  .a3 { animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.27s both; }
  .spinner { animation: spin 0.72s linear infinite; }
  .pop-in  { animation: popIn 0.3s cubic-bezier(0.22,1,0.36,1) both; }
  .form-enter { animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
`;

// ─────────────────────────────────────────────────────────────────────────────
// FORM SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const TagList = ({ items, onAdd, onRemove, placeholder }) => {
  const [draft, setDraft] = useState("");
  const add = () => { const v = draft.trim(); if (v) { onAdd(v); setDraft(""); } };
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2.5 min-h-6">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background:"rgba(15,98,254,0.07)", border:"1px solid rgba(15,98,254,0.18)", color:"#0f62fe" }}>
            {item}
            <button onClick={() => onRemove(i)} style={{ fontSize:"0.65rem", opacity:0.5, cursor:"pointer", background:"none", border:"none", color:"inherit", padding:0 }}
              onMouseOver={e=>e.target.style.opacity=1} onMouseOut={e=>e.target.style.opacity=0.5}>✕</button>
          </span>
        ))}
        {items.length === 0 && <span style={{ fontSize:"0.75rem", opacity:0.3, fontStyle:"italic" }}>None added yet</span>}
      </div>
      <div className="flex gap-2">
        <input className="input input-bordered input-sm flex-1" placeholder={placeholder} value={draft} autoComplete="off"
          onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(e.preventDefault(),add())} style={{ fontSize:"0.82rem" }} />
        <button onClick={add} style={{ display:"inline-flex", alignItems:"center", fontSize:"0.75rem", fontWeight:700, padding:"0.35rem 0.8rem", borderRadius:7, cursor:"pointer", background:"rgba(15,98,254,0.08)", border:"1px solid rgba(15,98,254,0.22)", color:"#0f62fe", minWidth:60 }}>+ Add</button>
      </div>
    </div>
  );
};

const Field = ({ label, required, children }) => (
  <div>
    <div style={{ fontSize:"0.7rem", fontWeight:700, marginBottom:"0.4rem", letterSpacing:"0.07em", textTransform:"uppercase", opacity:0.45 }}>
      {label}{required && <span style={{ color:"#ef4444", marginLeft:2 }}>*</span>}
    </div>
    {children}
  </div>
);

const Inp = ({ value, onChange, placeholder, type="text" }) => (
  <input type={type} className="input input-bordered w-full input-sm" value={value||""} onChange={onChange}
    placeholder={placeholder} autoComplete="off" style={{ fontSize:"0.875rem", height:"2.4rem", borderRadius:8 }} />
);

const Ta = ({ value, onChange, placeholder, rows=3 }) => (
  <textarea className="textarea textarea-bordered w-full textarea-sm" value={value||""} onChange={onChange}
    placeholder={placeholder} rows={rows} autoComplete="off" style={{ fontSize:"0.875rem", lineHeight:1.7, borderRadius:8, resize:"vertical" }} />
);

const Section = ({ title, icon, onAdd, addLabel, children }) => (
  <div style={{ background:"var(--b2,#f7f7fa)", border:"1px solid var(--b3,rgba(0,0,0,0.07))", borderRadius:16, marginBottom:16, overflow:"hidden" }}>
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"1rem 1.4rem", borderBottom:"1px solid var(--b3,rgba(0,0,0,0.06))", background:"var(--b1,#fff)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
        <span style={{ fontSize:"1.1rem" }}>{icon}</span>
        <span style={{ fontWeight:700, fontSize:"0.95rem" }}>{title}</span>
      </div>
      {onAdd && (
        <button onClick={onAdd} style={{ fontSize:"0.75rem", fontWeight:700, padding:"0.35rem 0.8rem", borderRadius:6, cursor:"pointer", background:"rgba(15,98,254,0.07)", border:"1px solid rgba(15,98,254,0.2)", color:"#0f62fe" }}>
          + {addLabel||"Add"}
        </button>
      )}
    </div>
    <div style={{ padding:"1.25rem 1.4rem" }}>{children}</div>
  </div>
);

const Divider = () => <div style={{ height:1, background:"var(--b3,rgba(0,0,0,0.07))", margin:"1.2rem 0" }} />;

const EntryHeader = ({ label, onRemove }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.9rem" }}>
    <span style={{ fontSize:"0.7rem", fontWeight:700, opacity:0.35, textTransform:"uppercase", letterSpacing:"0.1em" }}>{label}</span>
    <button onClick={onRemove} style={{ fontSize:"0.72rem", fontWeight:600, padding:"0.28rem 0.65rem", borderRadius:5, cursor:"pointer", background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.18)", color:"#dc2626" }}>✕ Remove</button>
  </div>
);

// Shared navbar
const Navbar = ({ center, rightSlot }) => (
  <nav style={{ position:"sticky", top:0, zIndex:100, backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", background:"var(--navbar-bg, rgba(255,255,255,0.88))", borderBottom:"1px solid var(--b3, rgba(0,0,0,0.07))" }}>
    <div style={{ maxWidth:860, margin:"0 auto", padding:"0 1.25rem", height:58, display:"flex", alignItems:"center", position:"relative" }}>
      <div style={{ fontWeight:800, fontSize:"1rem", letterSpacing:"-0.02em", flex:"0 0 auto" }}>
        Resume<span className="grad-text">AI</span>
      </div>
      {center && (
        <div style={{ position:"absolute", left:"50%", transform:"translateX(-50%)", fontSize:"0.875rem", fontWeight:600, opacity:0.5 }}>
          {center}
        </div>
      )}
      
    </div>
  </nav>
);

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — PROMPT PAGE
// ─────────────────────────────────────────────────────────────────────────────
const PromptPage = ({ onSuccess }) => {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const charCount = value.length;
  const circumference = 2 * Math.PI * 10;
  const strokeDash = circumference * Math.min(charCount / CHAR_LIMIT, 1);
  const isNearLimit = charCount >= CHAR_LIMIT * 0.85;
  const isOverLimit = charCount > CHAR_LIMIT;

  const handleSubmit = async () => {
    if (!value.trim() || isOverLimit || loading) return;
    try {
      setLoading(true);
      const responseData = await generateResume(value);
      console.log("Backend response:", responseData);
      toast.success("Resume Generated Successfully!", { duration: 3000, position: "top-center" });
      // pass the data section to the form
      onSuccess(responseData.data || responseData);
    } catch (error) {
      console.log(error);
      toast.error("Error Generating Resume!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        rightSlot={<div className="badge badge-ghost badge-sm font-bold tracking-widest">BETA</div>}
      />
      <main className="flex-1 flex items-center justify-center px-4" style={{ minHeight:"calc(100vh - 58px)" }}>
        <div className="w-full max-w-2xl py-6">

          <div className="a1 text-center mb-5">
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-md text-xs font-bold tracking-widest uppercase"
              style={{ background:"rgba(15,98,254,0.07)", border:"1px solid rgba(15,98,254,0.2)", color:"#0f62fe" }}>
              <span style={{ width:5, height:5, borderRadius:"50%", background:"#0f62fe", display:"inline-block" }} />
              Step 1 of 2
            </div>
            <h1 className="font-extrabold tracking-tight leading-tight"
              style={{ fontSize:"clamp(1.55rem,3.5vw,2.1rem)", letterSpacing:"-0.03em" }}>
              Tell us about <span className="grad-text">yourself</span>
            </h1>
            <p className="mt-1.5 text-xs leading-relaxed opacity-50 max-w-sm mx-auto">
              Write naturally — experience, skills, roles, and goals. The AI handles structure, wording, and formatting.
            </p>
          </div>

          <div className="a2 card bg-base-200 shadow-xl" style={{
            borderRadius:18,
            border: focused ? "1px solid rgba(15,98,254,0.4)" : "1px solid transparent",
            boxShadow: focused ? "0 0 0 4px rgba(15,98,254,0.09), 0 16px 48px rgba(0,0,0,0.07)" : undefined,
            transition:"border 0.22s, box-shadow 0.22s",
          }}>
            <div className="card-body p-5 gap-0">

              <div className="flex items-center justify-between mb-2.5">
                <label className="label-text font-bold text-sm">
                  Your background & experience <span className="text-error ml-0.5">*</span>
                </label>
                <div className="flex items-center gap-1.5" title={`${charCount}/${CHAR_LIMIT}`}>
                  <svg width="26" height="26" viewBox="0 0 26 26">
                    <circle cx="13" cy="13" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity:0.1 }} />
                    <circle cx="13" cy="13" r="10" fill="none"
                      stroke={isOverLimit?"#ef4444":isNearLimit?"#f59e0b":"#0f62fe"}
                      strokeWidth="2.5" strokeDasharray={`${strokeDash} ${circumference}`}
                      strokeLinecap="round" transform="rotate(-90 13 13)"
                      style={{ transition:"stroke-dasharray 0.2s, stroke 0.2s" }} />
                  </svg>
                  <span className="text-xs font-semibold"
                    style={{ color:isOverLimit?"#ef4444":isNearLimit?"#f59e0b":undefined, opacity:isNearLimit?1:0.4 }}>
                    {CHAR_LIMIT - charCount < 0 ? `+${charCount - CHAR_LIMIT}` : CHAR_LIMIT - charCount}
                  </span>
                </div>
              </div>

              <textarea
                className="textarea textarea-bordered desc-textarea w-full"
                rows={6}
                placeholder={`Example:\n\nI'm a software engineer with 5 years of experience in React and Node.js. I've led a team of 3 developers at a fintech startup, built a payment dashboard used by 20K users, and hold a CS degree from Mumbai University. Looking for senior frontend roles...`}
                value={value}
                onChange={e => { if (!loading) setValue(e.target.value); }}
                onFocus={() => { if (!loading) setFocused(true); }}
                onBlur={() => setFocused(false)}
                readOnly={loading}
                style={{ minHeight:160, opacity:loading?0.55:1, cursor:loading?"not-allowed":"text", transition:"opacity 0.2s" }}
              />

              <div className="mt-2.5 rounded-xl px-3.5 py-2.5 text-xs leading-relaxed"
                style={{ background:"rgba(15,98,254,0.06)", border:"1px solid rgba(15,98,254,0.15)", opacity:0.75 }}>
                <span style={{ fontWeight:700, color:"#0f62fe" }}>💡 Tips: </span>
                Include job title, years of experience, key skills, notable achievements, and the role you're targeting.
              </div>

              <button className="btn grad-btn w-full mt-4 text-sm" style={{ borderRadius:10, height:"2.9rem" }}
                onClick={handleSubmit} disabled={!value.trim()||isOverLimit||loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="spinner" width="17" height="17" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                      <path d="M12 3a9 9 0 0 1 9 9" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Generating your resume…
                  </span>
                ) : "Generate My Resume →"}
              </button>
            </div>
          </div>

          <div className="a3 mt-4">
            <p className="text-center text-xs font-bold opacity-40 tracking-widest uppercase mb-2">Try an example</p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map(s => (
                <button key={s} className="chip" onClick={() => setValue(s)}>
                  {s.length > 44 ? s.slice(0,44)+"…" : s}
                </button>
              ))}
            </div>
          </div>

        </div>
      </main>
      <footer className="py-3 text-center border-t border-base-300">
        <span className="text-xs opacity-35">© 2026 Resume<strong>AI</strong></span>
      </footer>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — RESUME FORM
// ─────────────────────────────────────────────────────────────────────────────
const ResumeFormPage = ({ resumeData, onBack, onSave }) => {
  const [form, setForm] = useState(() => initForm(resumeData));
  const [saved, setSaved] = useState(false);

  const setPersonal = (key, val) => setForm(f => ({ ...f, personalInformation:{ ...f.personalInformation, [key]:val } }));
  const addSkill    = (cat,val) => setForm(f => ({ ...f, skills:{ ...f.skills, [cat]:[...f.skills[cat],val] } }));
  const removeSkill = (cat,i)  => setForm(f => ({ ...f, skills:{ ...f.skills, [cat]:f.skills[cat].filter((_,idx)=>idx!==i) } }));
  const addItem     = (sec,tpl) => setForm(f => ({ ...f, [sec]:[...f[sec],{ ...tpl, _id:uid() }] }));
  const removeItem  = (sec,id)  => setForm(f => ({ ...f, [sec]:f[sec].filter(x=>x._id!==id) }));
  const updateItem  = (sec,id,key,val) => setForm(f => ({ ...f, [sec]:f[sec].map(x=>x._id===id?{ ...x,[key]:val }:x) }));
  const addTag      = (sec,name) => setForm(f => ({ ...f, [sec]:[...f[sec],{ _id:uid(),name }] }));
  const removeTag   = (sec,id)   => setForm(f => ({ ...f, [sec]:f[sec].filter(x=>x._id!==id) }));
  const addTech     = (pid,val) => setForm(f => ({ ...f, projects:f.projects.map(p=>p._id===pid?{ ...p, technologiesUsed:[...p.technologiesUsed,val] }:p) }));
  const removeTech  = (pid,i)   => setForm(f => ({ ...f, projects:f.projects.map(p=>p._id===pid?{ ...p, technologiesUsed:p.technologiesUsed.filter((_,idx)=>idx!==i) }:p) }));

  const handleSave = () => {
    const clean = {
      ...form,
      experience:     form.experience.map(({ _id,...r }) => r),
      education:      form.education.map(({ _id,...r }) => r),
      certifications: form.certifications.map(({ _id,...r }) => r),
      projects:       form.projects.map(({ _id,...r }) => r),
      achievements:   form.achievements.map(({ _id,...r }) => r),
      languages:      form.languages.map(({ _id,...r }) => r),
      interests:      form.interests.map(({ _id,...r }) => r),
    };
    console.log("Final Resume Data:", clean);
    if (onSave) { onSave(clean); } else { setSaved(true); setTimeout(() => setSaved(false), 3000); }
  };

  const empty = txt => <p style={{ fontSize:"0.82rem", opacity:0.35, fontStyle:"italic" }}>{txt}</p>;

  return (
    <div className="form-enter" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", minHeight:"100vh" }}>

      <Navbar
        center={<span>✏️ Edit your resume</span>}
        rightSlot={
          <div style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
            <button onClick={onBack} style={{ fontSize:"0.78rem", fontWeight:600, padding:"0.3rem 0.75rem", borderRadius:6, cursor:"pointer", background:"transparent", border:"1px solid rgba(0,0,0,0.12)", color:"inherit", opacity:0.55 }}>
              ← Back
            </button>
            {saved && (
              <span className="pop-in" style={{ display:"inline-flex", alignItems:"center", gap:"0.4rem", fontSize:"0.75rem", fontWeight:600, padding:"0.3rem 0.75rem", borderRadius:6, background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.25)", color:"#16a34a" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Saved
              </span>
            )}
            <button onClick={handleSave} className="btn btn-sm grad-btn" style={{ padding:"0 1.1rem", height:"2.1rem", fontSize:"0.82rem", borderRadius:8 }}>
              Save &amp; Preview →
            </button>
          </div>
        }
      />

      <main style={{ maxWidth:860, margin:"0 auto", padding:"2rem 1.25rem 4rem" }}>

        {/* PERSONAL INFO */}
        <Section title="Personal Information" icon="👤">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" required><Inp value={form.personalInformation.fullName} onChange={e=>setPersonal("fullName",e.target.value)} placeholder="Your full name"/></Field>
            <Field label="Email" required><Inp value={form.personalInformation.email} onChange={e=>setPersonal("email",e.target.value)} placeholder="email@example.com" type="email"/></Field>
            <Field label="Phone Number"><Inp value={form.personalInformation.phoneNumber} onChange={e=>setPersonal("phoneNumber",e.target.value)} placeholder="+91 00000 00000"/></Field>
            <Field label="Location"><Inp value={form.personalInformation.location} onChange={e=>setPersonal("location",e.target.value)} placeholder="City, Country"/></Field>
            <Field label="LinkedIn URL"><Inp value={form.personalInformation.linkedin} onChange={e=>setPersonal("linkedin",e.target.value)} placeholder="https://linkedin.com/in/..."/></Field>
            <Field label="GitHub URL"><Inp value={form.personalInformation.gitHub} onChange={e=>setPersonal("gitHub",e.target.value)} placeholder="https://github.com/..."/></Field>
            <Field label="Portfolio URL"><Inp value={form.personalInformation.portfolio} onChange={e=>setPersonal("portfolio",e.target.value)} placeholder="https://yourportfolio.com"/></Field>
          </div>
        </Section>

        {/* SUMMARY */}
        <Section title="Professional Summary" icon="📝">
          <Field label="Summary"><Ta value={form.summary} onChange={e=>setForm(f=>({ ...f,summary:e.target.value }))} placeholder="Write a brief professional summary..." rows={4}/></Field>
        </Section>

        {/* SKILLS */}
        <Section title="Skills" icon="⚡">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SKILL_KEYS.map(cat => (
              <div key={cat} style={{ padding:"1rem", borderRadius:10, background:"var(--b1,#fff)", border:"1px solid var(--b3,rgba(0,0,0,0.06))" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", marginBottom:"0.75rem" }}>
                  <span>{SKILL_ICONS[cat]}</span>
                  <span style={{ fontSize:"0.72rem", fontWeight:700, opacity:0.5, textTransform:"uppercase", letterSpacing:"0.08em" }}>{SKILL_LABELS[cat]}</span>
                </div>
                <TagList items={form.skills[cat]} onAdd={v=>addSkill(cat,v)} onRemove={i=>removeSkill(cat,i)} placeholder={`Add...`}/>
              </div>
            ))}
          </div>
        </Section>

        {/* EXPERIENCE */}
        <Section title="Experience" icon="💼" onAdd={()=>addItem("experience",{ jobTitle:"",company:"",location:"",duration:"",responsibility:"" })} addLabel="Add Role">
          {form.experience.length===0 && empty("No experience added yet.")}
          {form.experience.map((exp,idx) => (
            <div key={exp._id}>
              {idx>0&&<Divider/>}
              <EntryHeader label={`Role ${idx+1}`} onRemove={()=>removeItem("experience",exp._id)}/>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Job Title"><Inp value={exp.jobTitle} onChange={e=>updateItem("experience",exp._id,"jobTitle",e.target.value)} placeholder="e.g. Software Engineer"/></Field>
                <Field label="Company"><Inp value={exp.company} onChange={e=>updateItem("experience",exp._id,"company",e.target.value)} placeholder="Company name"/></Field>
                <Field label="Location"><Inp value={exp.location} onChange={e=>updateItem("experience",exp._id,"location",e.target.value)} placeholder="City, Country"/></Field>
                <Field label="Duration"><Inp value={exp.duration} onChange={e=>updateItem("experience",exp._id,"duration",e.target.value)} placeholder="Jan 2022 - Present"/></Field>
                <div className="sm:col-span-2"><Field label="Responsibilities"><Ta value={exp.responsibility} onChange={e=>updateItem("experience",exp._id,"responsibility",e.target.value)} placeholder="Describe your key responsibilities..." rows={3}/></Field></div>
              </div>
            </div>
          ))}
        </Section>

        {/* EDUCATION */}
        <Section title="Education" icon="🎓" onAdd={()=>addItem("education",{ degree:"",university:"",location:"",graduationYear:"" })} addLabel="Add Degree">
          {form.education.length===0 && empty("No education added yet.")}
          {form.education.map((edu,idx) => (
            <div key={edu._id}>
              {idx>0&&<Divider/>}
              <EntryHeader label={`Degree ${idx+1}`} onRemove={()=>removeItem("education",edu._id)}/>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Degree"><Inp value={edu.degree} onChange={e=>updateItem("education",edu._id,"degree",e.target.value)} placeholder="e.g. B.Tech Computer Science"/></Field>
                <Field label="University"><Inp value={edu.university} onChange={e=>updateItem("education",edu._id,"university",e.target.value)} placeholder="University name"/></Field>
                <Field label="Location"><Inp value={edu.location} onChange={e=>updateItem("education",edu._id,"location",e.target.value)} placeholder="City, Country"/></Field>
                <Field label="Graduation Year"><Inp value={edu.graduationYear} onChange={e=>updateItem("education",edu._id,"graduationYear",e.target.value)} placeholder="e.g. 2023"/></Field>
              </div>
            </div>
          ))}
        </Section>

        {/* CERTIFICATIONS */}
        <Section title="Certifications" icon="🏆" onAdd={()=>addItem("certifications",{ title:"",issuingOrganization:"",year:"" })} addLabel="Add Certification">
          {form.certifications.length===0 && empty("No certifications added yet.")}
          {form.certifications.map((cert,idx) => (
            <div key={cert._id}>
              {idx>0&&<Divider/>}
              <EntryHeader label={`Certification ${idx+1}`} onRemove={()=>removeItem("certifications",cert._id)}/>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field label="Title"><Inp value={cert.title} onChange={e=>updateItem("certifications",cert._id,"title",e.target.value)} placeholder="Certification name"/></Field>
                <Field label="Issuing Organization"><Inp value={cert.issuingOrganization} onChange={e=>updateItem("certifications",cert._id,"issuingOrganization",e.target.value)} placeholder="e.g. Google, AWS"/></Field>
                <Field label="Year"><Inp value={cert.year} onChange={e=>updateItem("certifications",cert._id,"year",e.target.value)} placeholder="e.g. 2023"/></Field>
              </div>
            </div>
          ))}
        </Section>

        {/* PROJECTS */}
        <Section title="Projects" icon="🚀" onAdd={()=>addItem("projects",{ title:"",description:"",technologiesUsed:[],githubLink:"" })} addLabel="Add Project">
          {form.projects.length===0 && empty("No projects added yet.")}
          {form.projects.map((proj,idx) => (
            <div key={proj._id}>
              {idx>0&&<Divider/>}
              <EntryHeader label={`Project ${idx+1}`} onRemove={()=>removeItem("projects",proj._id)}/>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Title"><Inp value={proj.title} onChange={e=>updateItem("projects",proj._id,"title",e.target.value)} placeholder="Project name"/></Field>
                <Field label="GitHub Link"><Inp value={proj.githubLink} onChange={e=>updateItem("projects",proj._id,"githubLink",e.target.value)} placeholder="https://github.com/..."/></Field>
                <div className="sm:col-span-2"><Field label="Description"><Ta value={proj.description} onChange={e=>updateItem("projects",proj._id,"description",e.target.value)} placeholder="Describe the project..." rows={3}/></Field></div>
                <div className="sm:col-span-2"><Field label="Technologies Used"><TagList items={proj.technologiesUsed} onAdd={v=>addTech(proj._id,v)} onRemove={i=>removeTech(proj._id,i)} placeholder="Add technology..."/></Field></div>
              </div>
            </div>
          ))}
        </Section>

        {/* ACHIEVEMENTS */}
        <Section title="Achievements" icon="🌟" onAdd={()=>addItem("achievements",{ title:"",year:"",extraInformation:"" })} addLabel="Add Achievement">
          {form.achievements.length===0 && empty("No achievements added yet.")}
          {form.achievements.map((ach,idx) => (
            <div key={ach._id}>
              {idx>0&&<Divider/>}
              <EntryHeader label={`Achievement ${idx+1}`} onRemove={()=>removeItem("achievements",ach._id)}/>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Title"><Inp value={ach.title} onChange={e=>updateItem("achievements",ach._id,"title",e.target.value)} placeholder="Achievement title"/></Field>
                <Field label="Year"><Inp value={ach.year} onChange={e=>updateItem("achievements",ach._id,"year",e.target.value)} placeholder="e.g. 2023"/></Field>
                <div className="sm:col-span-2"><Field label="Extra Information"><Ta value={ach.extraInformation} onChange={e=>updateItem("achievements",ach._id,"extraInformation",e.target.value)} placeholder="Additional details..." rows={2}/></Field></div>
              </div>
            </div>
          ))}
        </Section>

        {/* LANGUAGES */}
        <Section title="Languages" icon="🌐">
          <TagList items={form.languages.map(l=>l.name)} onAdd={name=>addTag("languages",name)} onRemove={i=>removeTag("languages",form.languages[i]._id)} placeholder="Add a language..."/>
        </Section>

        {/* INTERESTS */}
        <Section title="Interests & Hobbies" icon="✨">
          <TagList items={form.interests.map(l=>l.name)} onAdd={name=>addTag("interests",name)} onRemove={i=>removeTag("interests",form.interests[i]._id)} placeholder="Add an interest..."/>
        </Section>

        {/* BOTTOM SAVE */}
        <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"1.5rem" }}>
          <button onClick={handleSave} className="btn grad-btn" style={{ padding:"0 2rem", height:"2.8rem", fontSize:"0.92rem", borderRadius:10 }}>
            Save &amp; Preview Resume →
          </button>
        </div>

      </main>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOT — controls which step is shown
// ─────────────────────────────────────────────────────────────────────────────
const GenerateResume = () => {
  const [step, setStep] = useState("prompt");   // "prompt" | "form"
  const [resumeData, setResumeData] = useState(null);
  const [previewData, setPreviewData] = useState(null);

  const handleSuccess = (data) => {
    setResumeData(data);
    setStep("form");
  };

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{STYLES}</style>
      {step === "prompt" && <PromptPage onSuccess={handleSuccess} />}
      {step === "form"    && <ResumeFormPage resumeData={resumeData} onBack={() => setStep("prompt")} onSave={(clean) => { setPreviewData(clean); setStep("preview"); }} />}
      {step === "preview" && <ResumePreview data={previewData} onBack={() => setStep("form")} />}
    </div>
  );
};

export default GenerateResume;
// This file intentionally left blank - see main file