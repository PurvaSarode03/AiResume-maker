import React, { useState, useEffect } from "react";

const ACCENT = "#1a56db";
const ACCENT_LIGHT = "rgba(26,86,219,0.07)";

// ─────────────────────────────────────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const contactField = (icon, value) => value
  ? `<span style="display:inline-flex;align-items:center;gap:4px;margin-right:14px;margin-bottom:4px;font-size:11px">${icon}${value}</span>`
  : "";

const secHead = (title, color = "#1a56db", borderColor = "#1a56db") =>
  `<div style="font-size:9px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:${color};border-bottom:2px solid ${borderColor};padding-bottom:3px;margin:16px 0 8px">${title}</div>`;

const tag = (text, bg = "rgba(26,86,219,0.08)", color = "#1a56db") =>
  `<span style="display:inline-block;font-size:10.5px;font-weight:600;padding:2px 9px;background:${bg};color:${color};margin:2px 3px 2px 0;border-radius:3px">${text}</span>`;

const neutralTag = (text) =>
  `<span style="display:inline-block;font-size:10.5px;font-weight:500;padding:2px 9px;background:#f3f4f6;color:#374151;margin:2px 3px 2px 0;border-radius:3px">${text}</span>`;

const SKILL_DEFS = [
  { label: "Programming Languages", key: "programmingLanguages" },
  { label: "Frameworks",            key: "frameworks" },
  { label: "Databases",             key: "databases" },
  { label: "Cloud",                 key: "cloud" },
  { label: "DevOps Tools",          key: "devOpsTools" },
  { label: "Other Skills",          key: "otherSkills" },
];

const buildSkillsHTML = (sk, labelColor = "#1a56db", tagBg = "rgba(26,86,219,0.08)", tagColor = "#1a56db") =>
  SKILL_DEFS.filter(d => sk[d.key]?.length > 0).map(d =>
    `<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:6px">
      <span style="font-size:10px;font-weight:700;color:${labelColor};min-width:120px;padding-top:3px">${d.label}:</span>
      <div>${sk[d.key].map(s => tag(s, tagBg, tagColor)).join("")}</div>
    </div>`
  ).join("");

const buildExpHTML = (exp, accentColor = "#1a56db") =>
  (exp || []).map(e =>
    `<div style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div style="font-weight:700;font-size:13px;color:#111827">${e.jobTitle||""}</div>
          <div style="font-size:11px;color:${accentColor};font-weight:600;margin-top:2px">${[e.company,e.location].filter(Boolean).join(" · ")}</div>
        </div>
        <div style="font-size:11px;color:#6b7280;white-space:nowrap;margin-left:8px">${e.duration||""}</div>
      </div>
      ${e.responsibility ? `<p style="font-size:11.5px;line-height:1.7;color:#4b5563;margin-top:4px">${e.responsibility}</p>` : ""}
    </div>`
  ).join("");

const buildEduHTML = (edu, accentColor = "#1a56db") =>
  (edu || []).map(e =>
    `<div style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between">
        <div>
          <div style="font-weight:700;font-size:13px;color:#111827">${e.degree||""}</div>
          <div style="font-size:11px;color:${accentColor};font-weight:600;margin-top:2px">${[e.university,e.location].filter(Boolean).join(" · ")}</div>
        </div>
        <div style="font-size:11px;color:#6b7280">${e.graduationYear||""}</div>
      </div>
    </div>`
  ).join("");

const buildProjHTML = (projects, accentColor = "#1a56db") =>
  (projects || []).map(pr =>
    `<div style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-weight:700;font-size:13px;color:#111827">${pr.title||""}</span>
        ${pr.githubLink ? `<a href="${pr.githubLink}" style="font-size:11px;color:${accentColor};font-weight:600">GitHub ↗</a>` : ""}
      </div>
      ${pr.description ? `<p style="font-size:11.5px;line-height:1.7;color:#4b5563;margin-top:3px">${pr.description}</p>` : ""}
      ${(pr.technologiesUsed||[]).length > 0 ? `<div style="margin-top:5px">${pr.technologiesUsed.map(t => tag(t)).join("")}</div>` : ""}
    </div>`
  ).join("");

const buildCertHTML = (certs) =>
  (certs || []).map(c =>
    `<div style="margin-bottom:8px">
      <div style="font-weight:700;font-size:12px;color:#111827">${c.title||""}</div>
      ${c.issuingOrganization ? `<div style="font-size:11px;color:#6b7280">${c.issuingOrganization}${c.year ? " · " + c.year : ""}</div>` : ""}
    </div>`
  ).join("");

const buildAchHTML = (achs) =>
  (achs || []).map(a =>
    `<div style="margin-bottom:8px">
      <div style="display:flex;justify-content:space-between">
        <span style="font-weight:700;font-size:12px;color:#111827">${a.title||""}</span>
        <span style="font-size:11px;color:#6b7280">${a.year||""}</span>
      </div>
      ${a.extraInformation ? `<p style="font-size:11px;color:#4b5563;margin-top:2px;line-height:1.6">${a.extraInformation}</p>` : ""}
    </div>`
  ).join("");

// ── FIXED: use <table> instead of CSS grid so print layout is stable ──
const twoColHTML = (left, right) =>
  (left || right) ? `
  <table style="width:100%;border-collapse:collapse;table-layout:fixed;margin-top:4px">
    <tr>
      <td style="width:50%;vertical-align:top;padding-right:16px">${left||""}</td>
      <td style="width:50%;vertical-align:top;padding-left:8px">${right||""}</td>
    </tr>
  </table>` : "";

const footerHTML = `<div style="background:#f9fafb;border-top:1px solid #f0f0f5;padding:8px 36px;display:flex;justify-content:space-between">
  <span style="font-size:9px;opacity:0.3;font-weight:700;letter-spacing:0.08em">AI RESUME MAKER</span>
  <span style="font-size:9px;opacity:0.3">${new Date().getFullYear()}</span>
</div>`;

// ── FIXED: added print media query to force table layout ──
const BASE_STYLE = `
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Plus Jakarta Sans',sans-serif;background:#fff}
  table{border-collapse:collapse;table-layout:fixed}
  td{vertical-align:top}
  @media print{
    @page{margin:0;size:A4}
    body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
    table{width:100%!important;display:table!important}
    tr{display:table-row!important}
    td{display:table-cell!important;vertical-align:top!important}
  }
`;

const FONT_LINK = `<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>`;

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 1 — Blue Gradient
// ─────────────────────────────────────────────────────────────────────────────
const buildTemplate1 = (data) => {
  const p  = data?.personalInformation || {};
  const sk = data?.skills || {};
  const contactRow = [
    contactField(`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" style="color:white"><rect x="2" y="4" width="20" height="16" rx="2" stroke="white" stroke-width="2"/><path d="M2 7l10 7 10-7" stroke="white" stroke-width="2"/></svg>`, p.email),
    contactField(`<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6.6 10.8a15.2 15.2 0 006.6 6.6l2.2-2.2a1 1 0 011.1-.24 11.4 11.4 0 003.9.76 1 1 0 011 1V20a1 1 0 01-1 1C9.61 21 3 14.39 3 6.5a1 1 0 011-1H7.5a1 1 0 011 1c0 1.38.27 2.7.76 3.9a1 1 0 01-.26 1.1L6.6 10.8z" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`, p.phoneNumber),
    contactField(`<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="white" stroke-width="2"/><circle cx="12" cy="9" r="2.5" stroke="white" stroke-width="2"/></svg>`, p.location),
    contactField(`<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" stroke="white" stroke-width="2"/><line x1="8" y1="11" x2="8" y2="17" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="7" x2="8" y2="8" stroke="white" stroke-width="2.5" stroke-linecap="round"/><path d="M12 17v-4a2 2 0 014 0v4M12 11v6" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`, p.linkedin),
    contactField(`<svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.578 9.578 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>`, p.gitHub),
    contactField(`<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" stroke-width="2"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="white" stroke-width="2"/></svg>`, p.portfolio),
  ].filter(Boolean).join("");

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>${p.fullName||"Resume"}</title>${FONT_LINK}<style>${BASE_STYLE}</style></head><body>
<div style="max-width:820px;margin:0 auto;background:#fff">
  <div style="background:linear-gradient(125deg,#1a56db,#1e40af);padding:30px 36px 22px;color:#fff">
    <h1 style="font-size:30px;font-weight:800;color:#fff;margin-bottom:12px;letter-spacing:-0.02em">${p.fullName||""}</h1>
    <div style="display:flex;flex-wrap:wrap;row-gap:5px;color:#fff">${contactRow}</div>
  </div>
  <div style="padding:18px 36px 36px">
    ${data?.summary ? `${secHead("Career Objective")}<p style="font-size:12px;line-height:1.78;color:#374151">${data.summary}</p>` : ""}
    ${buildSkillsHTML(sk).length > 0 ? `${secHead("Skills")}${buildSkillsHTML(sk)}` : ""}
    ${(data?.experience||[]).length > 0 ? `${secHead("Experience")}${buildExpHTML(data.experience)}` : ""}
    ${(data?.education||[]).length > 0 ? `${secHead("Education")}${buildEduHTML(data.education)}` : ""}
    ${(data?.projects||[]).length > 0 ? `${secHead("Projects")}${buildProjHTML(data.projects)}` : ""}
    ${twoColHTML(
      (data?.certifications||[]).length > 0 ? secHead("Certifications") + buildCertHTML(data.certifications) : "",
      (data?.achievements||[]).length > 0 ? secHead("Achievements") + buildAchHTML(data.achievements) : ""
    )}
    ${twoColHTML(
      (data?.languages||[]).length > 0 ? secHead("Languages") + `<div>${(data.languages||[]).map(l=>neutralTag(l.name)).join("")}</div>` : "",
      (data?.interests||[]).length > 0 ? secHead("Interests") + `<div>${(data.interests||[]).map(l=>neutralTag(l.name)).join("")}</div>` : ""
    )}
  </div>
  ${footerHTML}
</div>
<script>window.onload=()=>setTimeout(()=>window.print(),400)</script>
</body></html>`;
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 2 — Classic
// ─────────────────────────────────────────────────────────────────────────────
const buildTemplate2 = (data) => {
  const p  = data?.personalInformation || {};
  const sk = data?.skills || {};
  const contactRow = [p.email, p.phoneNumber, p.location, p.linkedin, p.gitHub, p.portfolio]
    .filter(Boolean).map(v => `<span style="font-size:11px;color:#4b5563;margin-right:16px">${v}</span>`).join("");

  const secH = (title) =>
    `<div style="font-size:9px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#111827;border-bottom:2px solid #111827;padding-bottom:3px;margin:16px 0 8px">${title}</div>`;

  const skRows = SKILL_DEFS.filter(d => sk[d.key]?.length > 0).map(d =>
    `<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:5px">
      <span style="font-size:10px;font-weight:700;color:#374151;min-width:120px;padding-top:2px">${d.label}:</span>
      <span style="font-size:11px;color:#4b5563">${sk[d.key].join(", ")}</span>
    </div>`
  ).join("");

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>${p.fullName||"Resume"}</title>${FONT_LINK}<style>${BASE_STYLE}</style></head><body>
<div style="max-width:820px;margin:0 auto;background:#fff;padding:40px 48px">
  <div style="text-align:center;border-bottom:3px solid #111827;padding-bottom:18px;margin-bottom:4px">
    <h1 style="font-size:32px;font-weight:800;color:#111827;letter-spacing:-0.02em;margin-bottom:8px">${p.fullName||""}</h1>
    <div style="display:flex;flex-wrap:wrap;justify-content:center">${contactRow}</div>
  </div>
  ${data?.summary ? `${secH("Career Objective")}<p style="font-size:12px;line-height:1.78;color:#374151">${data.summary}</p>` : ""}
  ${skRows.length > 0 ? `${secH("Skills")}${skRows}` : ""}
  ${(data?.experience||[]).length > 0 ? `${secH("Experience")}${buildExpHTML(data.experience,"#374151")}` : ""}
  ${(data?.education||[]).length > 0 ? `${secH("Education")}${buildEduHTML(data.education,"#374151")}` : ""}
  ${(data?.projects||[]).length > 0 ? `${secH("Projects")}${buildProjHTML(data.projects,"#374151")}` : ""}
  ${twoColHTML(
    (data?.certifications||[]).length > 0 ? secH("Certifications") + buildCertHTML(data.certifications) : "",
    (data?.achievements||[]).length > 0 ? secH("Achievements") + buildAchHTML(data.achievements) : ""
  )}
  ${twoColHTML(
    (data?.languages||[]).length > 0 ? secH("Languages") + `<div style="font-size:11px;color:#4b5563">${(data.languages||[]).map(l=>l.name).join(", ")}</div>` : "",
    (data?.interests||[]).length > 0 ? secH("Interests") + `<div style="font-size:11px;color:#4b5563">${(data.interests||[]).map(l=>l.name).join(", ")}</div>` : ""
  )}
  <div style="margin-top:32px;text-align:center;font-size:9px;opacity:0.25;letter-spacing:0.08em;font-weight:700">AI RESUME MAKER · ${new Date().getFullYear()}</div>
</div>
<script>window.onload=()=>setTimeout(()=>window.print(),400)</script>
</body></html>`;
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 3 — Modern Sidebar
// ─────────────────────────────────────────────────────────────────────────────
const buildTemplate3 = (data) => {
  const p  = data?.personalInformation || {};
  const sk = data?.skills || {};

  const sideSecH = (title) =>
    `<div style="font-size:9px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#93c5fd;border-bottom:1px solid rgba(255,255,255,0.15);padding-bottom:3px;margin:18px 0 8px">${title}</div>`;

  const mainSecH = (title) =>
    `<div style="font-size:9px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#1a56db;border-bottom:2px solid #1a56db;padding-bottom:3px;margin:16px 0 8px">${title}</div>`;

  const sideSkillsHTML = SKILL_DEFS.filter(d => sk[d.key]?.length > 0).map(d =>
    `<div style="margin-bottom:10px">
      <div style="font-size:9.5px;font-weight:700;color:#bfdbfe;margin-bottom:4px">${d.label}</div>
      <div>${sk[d.key].map(s => `<span style="display:inline-block;font-size:10px;font-weight:600;padding:2px 8px;background:rgba(255,255,255,0.12);color:#e0f2fe;margin:2px 2px 2px 0;border-radius:3px">${s}</span>`).join("")}</div>
    </div>`
  ).join("");

  const contactSide = [
    p.email       ? `<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;font-size:11px;color:#e2e8f0;word-break:break-all">✉ ${p.email}</div>` : "",
    p.phoneNumber ? `<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;font-size:11px;color:#e2e8f0">✆ ${p.phoneNumber}</div>` : "",
    p.location    ? `<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;font-size:11px;color:#e2e8f0">⊙ ${p.location}</div>` : "",
    p.linkedin    ? `<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;font-size:11px;color:#e2e8f0;word-break:break-all">in ${p.linkedin}</div>` : "",
    p.gitHub      ? `<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;font-size:11px;color:#e2e8f0;word-break:break-all">⌥ ${p.gitHub}</div>` : "",
    p.portfolio   ? `<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;font-size:11px;color:#e2e8f0;word-break:break-all">⊕ ${p.portfolio}</div>` : "",
  ].filter(Boolean).join("");

  const langInts = [
    (data?.languages||[]).length > 0 ? `${sideSecH("Languages")}<div>${(data.languages||[]).map(l=>`<span style="display:inline-block;font-size:10px;padding:2px 8px;background:rgba(255,255,255,0.1);color:#e0f2fe;margin:2px 2px 2px 0;border-radius:3px">${l.name}</span>`).join("")}</div>` : "",
    (data?.interests||[]).length > 0 ? `${sideSecH("Interests")}<div>${(data.interests||[]).map(l=>`<span style="display:inline-block;font-size:10px;padding:2px 8px;background:rgba(255,255,255,0.1);color:#e0f2fe;margin:2px 2px 2px 0;border-radius:3px">${l.name}</span>`).join("")}</div>` : "",
  ].filter(Boolean).join("");

  // Template 3 uses a two-column layout for the whole page — also use table for print safety
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>${p.fullName||"Resume"}</title>${FONT_LINK}<style>${BASE_STYLE}
  .sidebar{background:linear-gradient(180deg,#0f172a,#1e3a5f);padding:32px 22px;color:#fff}
  .maincol{padding:32px 28px;background:#fff}
  @media print{
    .layout-table{width:100%!important;display:table!important}
    .layout-table tr{display:table-row!important}
    .sidebar,.maincol{display:table-cell!important;vertical-align:top!important}
    .sidebar{width:260px!important;background:linear-gradient(180deg,#0f172a,#1e3a5f)!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
  }
  </style></head><body>
<div style="max-width:820px;margin:0 auto;background:#fff">
  <table class="layout-table" style="width:100%;border-collapse:collapse;table-layout:fixed;min-height:100vh">
    <tr>
      <td class="sidebar" style="width:260px;vertical-align:top;background:linear-gradient(180deg,#0f172a,#1e3a5f);padding:32px 22px;color:#fff">
        <div style="margin-bottom:24px">
          <h1 style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.02em;line-height:1.2;margin-bottom:4px">${p.fullName||""}</h1>
          <div style="font-size:11px;color:#93c5fd;font-weight:600">${(data?.experience||[])[0]?.jobTitle || "Professional"}</div>
        </div>
        ${sideSecH("Contact")}${contactSide}
        ${sideSkillsHTML.length > 0 ? `${sideSecH("Skills")}${sideSkillsHTML}` : ""}
        ${langInts}
      </td>
      <td class="maincol" style="vertical-align:top;padding:32px 28px;background:#fff">
        ${data?.summary ? `${mainSecH("Career Objective")}<p style="font-size:12px;line-height:1.78;color:#374151">${data.summary}</p>` : ""}
        ${(data?.experience||[]).length > 0 ? `${mainSecH("Experience")}${buildExpHTML(data.experience)}` : ""}
        ${(data?.education||[]).length > 0 ? `${mainSecH("Education")}${buildEduHTML(data.education)}` : ""}
        ${(data?.projects||[]).length > 0 ? `${mainSecH("Projects")}${buildProjHTML(data.projects)}` : ""}
        ${(data?.certifications||[]).length > 0 ? `${mainSecH("Certifications")}${buildCertHTML(data.certifications)}` : ""}
        ${(data?.achievements||[]).length > 0 ? `${mainSecH("Achievements")}${buildAchHTML(data.achievements)}` : ""}
        <div style="margin-top:auto;padding-top:32px;font-size:9px;opacity:0.2;letter-spacing:0.08em;font-weight:700">AI RESUME MAKER · ${new Date().getFullYear()}</div>
      </td>
    </tr>
  </table>
</div>
<script>window.onload=()=>setTimeout(()=>window.print(),400)</script>
</body></html>`;
};

const BUILDERS = { t1: buildTemplate1, t2: buildTemplate2, t3: buildTemplate3 };

// ─────────────────────────────────────────────────────────────────────────────
// PREVIEW RENDERERS (inline React)
// ─────────────────────────────────────────────────────────────────────────────
const SectionHead = ({ children, color = ACCENT }) => (
  <div style={{ fontSize:"0.62rem", fontWeight:800, letterSpacing:"0.15em", textTransform:"uppercase", color, borderBottom:`2px solid ${color}`, paddingBottom:4, marginBottom:10, marginTop:20 }}>
    {children}
  </div>
);

const SkillRowPreview = ({ label, items, labelColor = ACCENT, tagBg = ACCENT_LIGHT, tagColor = ACCENT }) => {
  if (!items?.length) return null;
  return (
    <div style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:6 }}>
      <span style={{ fontSize:"0.67rem", fontWeight:700, color:labelColor, minWidth:130, paddingTop:3 }}>{label}:</span>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"3px 5px" }}>
        {items.map((s,i) => <span key={i} style={{ fontSize:"0.7rem", fontWeight:600, color:tagColor, background:tagBg, padding:"2px 8px", borderRadius:3 }}>{s}</span>)}
      </div>
    </div>
  );
};

const ContactChipPreview = ({ icon, value, color = "#fff" }) => {
  if (!value) return null;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:"0.72rem", color, marginRight:14, marginBottom:4 }}>
      {icon}<span>{value}</span>
    </span>
  );
};

const SVG_ICONS = {
  email:    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="2" stroke="white" strokeWidth="2"/><path d="M2 7l10 7 10-7" stroke="white" strokeWidth="2"/></svg>,
  phone:    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6.6 10.8a15.2 15.2 0 006.6 6.6l2.2-2.2a1 1 0 011.1-.24 11.4 11.4 0 003.9.76 1 1 0 011 1V20a1 1 0 01-1 1C9.61 21 3 14.39 3 6.5a1 1 0 011-1H7.5a1 1 0 011 1c0 1.38.27 2.7.76 3.9a1 1 0 01-.26 1.1L6.6 10.8z" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>,
  location: <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="white" strokeWidth="2"/><circle cx="12" cy="9" r="2.5" stroke="white" strokeWidth="2"/></svg>,
  linkedin: <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" stroke="white" strokeWidth="2"/><line x1="8" y1="11" x2="8" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="7" x2="8" y2="8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><path d="M12 17v-4a2 2 0 014 0v4M12 11v6" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>,
  github:   <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.578 9.578 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>,
  portfolio:<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="white" strokeWidth="2"/></svg>,
};

// ─────────────────────────────────────────────────────────────────────────────
// PREVIEW COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const ResumeT1 = ({ data }) => {
  const p = data?.personalInformation || {};
  const sk = data?.skills || {};
  const skillDefs = SKILL_DEFS.filter(d => sk[d.key]?.length > 0);
  return (
    <div style={{ background:"#fff", overflow:"hidden" }}>
      <div style={{ background:"linear-gradient(125deg,#1a56db,#1e40af)", padding:"2rem 2.5rem 1.6rem" }}>
        <h1 style={{ fontSize:"clamp(1.6rem,4vw,2.3rem)", fontWeight:800, color:"#fff", letterSpacing:"-0.025em", marginBottom:12 }}>{p.fullName||"Your Name"}</h1>
        <div style={{ display:"flex", flexWrap:"wrap" }}>
          <ContactChipPreview icon={SVG_ICONS.email}    value={p.email} />
          <ContactChipPreview icon={SVG_ICONS.phone}    value={p.phoneNumber} />
          <ContactChipPreview icon={SVG_ICONS.location} value={p.location} />
          <ContactChipPreview icon={SVG_ICONS.linkedin} value={p.linkedin} />
          <ContactChipPreview icon={SVG_ICONS.github}   value={p.gitHub} />
          <ContactChipPreview icon={SVG_ICONS.portfolio}value={p.portfolio} />
        </div>
      </div>
      <div style={{ padding:"1.2rem 2.5rem 2.5rem" }}>
        {data?.summary && (<><SectionHead>Career Objective</SectionHead><p style={{ fontSize:"0.82rem", lineHeight:1.78, color:"#374151" }}>{data.summary}</p></>)}
        {skillDefs.length > 0 && (<><SectionHead>Skills</SectionHead>{skillDefs.map(d=><SkillRowPreview key={d.key} label={d.label} items={sk[d.key]}/>)}</>)}
        {(data?.experience||[]).length > 0 && (<><SectionHead>Experience</SectionHead>{data.experience.map((exp,i)=>(
          <div key={i} style={{ marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:4 }}>
              <div><div style={{ fontWeight:700, fontSize:"0.88rem", color:"#111827" }}>{exp.jobTitle}</div><div style={{ fontSize:"0.78rem", color:ACCENT, fontWeight:600, marginTop:2 }}>{[exp.company,exp.location].filter(Boolean).join(" · ")}</div></div>
              <div style={{ fontSize:"0.73rem", color:"#6b7280", fontWeight:500 }}>{exp.duration}</div>
            </div>
            {exp.responsibility && <p style={{ fontSize:"0.78rem", lineHeight:1.72, color:"#4b5563", marginTop:5 }}>{exp.responsibility}</p>}
          </div>
        ))}</>)}
        {(data?.education||[]).length > 0 && (<><SectionHead>Education</SectionHead>{data.education.map((edu,i)=>(
          <div key={i} style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:4 }}>
              <div><div style={{ fontWeight:700, fontSize:"0.88rem", color:"#111827" }}>{edu.degree}</div><div style={{ fontSize:"0.78rem", color:ACCENT, fontWeight:600, marginTop:2 }}>{[edu.university,edu.location].filter(Boolean).join(" · ")}</div></div>
              <div style={{ fontSize:"0.73rem", color:"#6b7280" }}>{edu.graduationYear}</div>
            </div>
          </div>
        ))}</>)}
        {(data?.projects||[]).length > 0 && (<><SectionHead>Projects</SectionHead>{data.projects.map((proj,i)=>(
          <div key={i} style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontWeight:700, fontSize:"0.88rem", color:"#111827" }}>{proj.title}</span>
              {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noreferrer" style={{ fontSize:"0.75rem", color:ACCENT, fontWeight:600 }}>GitHub ↗</a>}
            </div>
            {proj.description && <p style={{ fontSize:"0.78rem", lineHeight:1.7, color:"#4b5563", marginTop:3 }}>{proj.description}</p>}
            {(proj.technologiesUsed||[]).length > 0 && <div style={{ marginTop:5, display:"flex", flexWrap:"wrap", gap:"3px 5px" }}>{proj.technologiesUsed.map((t,i)=><span key={i} style={{ fontSize:"0.7rem", fontWeight:600, color:ACCENT, background:ACCENT_LIGHT, padding:"2px 8px", borderRadius:3 }}>{t}</span>)}</div>}
          </div>
        ))}</>)}
        {((data?.certifications||[]).length > 0 || (data?.achievements||[]).length > 0) && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem" }}>
            {(data?.certifications||[]).length > 0 && <div><SectionHead>Certifications</SectionHead>{data.certifications.map((c,i)=><div key={i} style={{ marginBottom:8 }}><div style={{ fontWeight:700, fontSize:"0.84rem", color:"#111827" }}>{c.title}</div>{c.issuingOrganization&&<div style={{ fontSize:"0.75rem", color:"#6b7280" }}>{c.issuingOrganization}{c.year?` · ${c.year}`:""}</div>}</div>)}</div>}
            {(data?.achievements||[]).length > 0 && <div><SectionHead>Achievements</SectionHead>{data.achievements.map((a,i)=><div key={i} style={{ marginBottom:8 }}><div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ fontWeight:700, fontSize:"0.84rem", color:"#111827" }}>{a.title}</span><span style={{ fontSize:"0.73rem", color:"#6b7280" }}>{a.year}</span></div>{a.extraInformation&&<p style={{ fontSize:"0.77rem", color:"#4b5563", marginTop:2 }}>{a.extraInformation}</p>}</div>)}</div>}
          </div>
        )}
        {((data?.languages||[]).length > 0 || (data?.interests||[]).length > 0) && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem" }}>
            {(data?.languages||[]).length > 0 && <div><SectionHead>Languages</SectionHead><div style={{ display:"flex", flexWrap:"wrap", gap:"3px 5px" }}>{data.languages.map((l,i)=><span key={i} style={{ fontSize:"0.75rem", fontWeight:500, padding:"3px 10px", borderRadius:3, background:"#f3f4f6", color:"#374151" }}>{l.name}</span>)}</div></div>}
            {(data?.interests||[]).length > 0 && <div><SectionHead>Interests</SectionHead><div style={{ display:"flex", flexWrap:"wrap", gap:"3px 5px" }}>{data.interests.map((l,i)=><span key={i} style={{ fontSize:"0.75rem", fontWeight:500, padding:"3px 10px", borderRadius:3, background:"#f3f4f6", color:"#374151" }}>{l.name}</span>)}</div></div>}
          </div>
        )}
      </div>
      <div style={{ background:"#f9fafb", borderTop:"1px solid #f0f0f5", padding:"0.6rem 2.5rem", display:"flex", justifyContent:"space-between" }}>
        <span style={{ fontSize:"0.6rem", opacity:0.3, fontWeight:700, letterSpacing:"0.08em" }}>AI RESUME MAKER</span>
        <span style={{ fontSize:"0.6rem", opacity:0.3 }}>{new Date().getFullYear()}</span>
      </div>
    </div>
  );
};

const ResumeT2 = ({ data }) => {
  const p  = data?.personalInformation || {};
  const sk = data?.skills || {};
  const skillDefs = SKILL_DEFS.filter(d => sk[d.key]?.length > 0);
  const BH = ({ children }) => <div style={{ fontSize:"0.62rem", fontWeight:800, letterSpacing:"0.15em", textTransform:"uppercase", color:"#111827", borderBottom:"2px solid #111827", paddingBottom:4, marginBottom:10, marginTop:20 }}>{children}</div>;
  return (
    <div style={{ background:"#fff", padding:"2.5rem 3rem" }}>
      <div style={{ textAlign:"center", borderBottom:"3px solid #111827", paddingBottom:18, marginBottom:4 }}>
        <h1 style={{ fontSize:"clamp(1.6rem,4vw,2.3rem)", fontWeight:800, color:"#111827", letterSpacing:"-0.025em", marginBottom:10 }}>{p.fullName||"Your Name"}</h1>
        <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"0 4px" }}>
          {[p.email, p.phoneNumber, p.location, p.linkedin, p.gitHub, p.portfolio].filter(Boolean).map((v,i) => <span key={i} style={{ fontSize:"0.72rem", color:"#4b5563", marginRight:14 }}>{v}</span>)}
        </div>
      </div>
      {data?.summary && (<><BH>Career Objective</BH><p style={{ fontSize:"0.82rem", lineHeight:1.78, color:"#374151" }}>{data.summary}</p></>)}
      {skillDefs.length > 0 && (<><BH>Skills</BH>{skillDefs.map(d=>(
        <div key={d.key} style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:5 }}>
          <span style={{ fontSize:"0.67rem", fontWeight:700, color:"#374151", minWidth:130, paddingTop:2 }}>{d.label}:</span>
          <span style={{ fontSize:"0.78rem", color:"#4b5563" }}>{sk[d.key].join(", ")}</span>
        </div>
      ))}</>)}
      {(data?.experience||[]).length > 0 && (<><BH>Experience</BH>{data.experience.map((exp,i)=>(
        <div key={i} style={{ marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:4 }}>
            <div><div style={{ fontWeight:700, fontSize:"0.88rem", color:"#111827" }}>{exp.jobTitle}</div><div style={{ fontSize:"0.78rem", color:"#374151", fontWeight:600, marginTop:2 }}>{[exp.company,exp.location].filter(Boolean).join(" · ")}</div></div>
            <div style={{ fontSize:"0.73rem", color:"#6b7280" }}>{exp.duration}</div>
          </div>
          {exp.responsibility && <p style={{ fontSize:"0.78rem", lineHeight:1.72, color:"#4b5563", marginTop:5 }}>{exp.responsibility}</p>}
        </div>
      ))}</>)}
      {(data?.education||[]).length > 0 && (<><BH>Education</BH>{data.education.map((edu,i)=>(
        <div key={i} style={{ marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:4 }}>
            <div><div style={{ fontWeight:700, fontSize:"0.88rem", color:"#111827" }}>{edu.degree}</div><div style={{ fontSize:"0.78rem", color:"#374151", fontWeight:600, marginTop:2 }}>{[edu.university,edu.location].filter(Boolean).join(" · ")}</div></div>
            <div style={{ fontSize:"0.73rem", color:"#6b7280" }}>{edu.graduationYear}</div>
          </div>
        </div>
      ))}</>)}
      {(data?.projects||[]).length > 0 && (<><BH>Projects</BH>{data.projects.map((proj,i)=>(
        <div key={i} style={{ marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontWeight:700, fontSize:"0.88rem", color:"#111827" }}>{proj.title}</span>
            {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noreferrer" style={{ fontSize:"0.75rem", color:"#374151", fontWeight:600 }}>GitHub ↗</a>}
          </div>
          {proj.description && <p style={{ fontSize:"0.78rem", lineHeight:1.7, color:"#4b5563", marginTop:3 }}>{proj.description}</p>}
        </div>
      ))}</>)}
      {((data?.certifications||[]).length > 0 || (data?.achievements||[]).length > 0) && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem" }}>
          {(data?.certifications||[]).length > 0 && <div><BH>Certifications</BH>{data.certifications.map((c,i)=><div key={i} style={{ marginBottom:8 }}><div style={{ fontWeight:700, fontSize:"0.84rem", color:"#111827" }}>{c.title}</div>{c.issuingOrganization&&<div style={{ fontSize:"0.75rem", color:"#6b7280" }}>{c.issuingOrganization}{c.year?` · ${c.year}`:""}</div>}</div>)}</div>}
          {(data?.achievements||[]).length > 0 && <div><BH>Achievements</BH>{data.achievements.map((a,i)=><div key={i} style={{ marginBottom:8 }}><div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ fontWeight:700, fontSize:"0.84rem", color:"#111827" }}>{a.title}</span><span style={{ fontSize:"0.73rem", color:"#6b7280" }}>{a.year}</span></div>{a.extraInformation&&<p style={{ fontSize:"0.77rem", color:"#4b5563", marginTop:2 }}>{a.extraInformation}</p>}</div>)}</div>}
        </div>
      )}
      {((data?.languages||[]).length > 0 || (data?.interests||[]).length > 0) && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem" }}>
          {(data?.languages||[]).length > 0 && <div><BH>Languages</BH><p style={{ fontSize:"0.78rem", color:"#4b5563" }}>{data.languages.map(l=>l.name).join(", ")}</p></div>}
          {(data?.interests||[]).length > 0 && <div><BH>Interests</BH><p style={{ fontSize:"0.78rem", color:"#4b5563" }}>{data.interests.map(l=>l.name).join(", ")}</p></div>}
        </div>
      )}
      <div style={{ marginTop:32, textAlign:"center", fontSize:"0.55rem", opacity:0.25, letterSpacing:"0.08em", fontWeight:700 }}>AI RESUME MAKER · {new Date().getFullYear()}</div>
    </div>
  );
};

const ResumeT3 = ({ data }) => {
  const p  = data?.personalInformation || {};
  const sk = data?.skills || {};
  const skillDefs = SKILL_DEFS.filter(d => sk[d.key]?.length > 0);
  const SH = ({ c="#93c5fd", children }) => <div style={{ fontSize:"0.6rem", fontWeight:800, letterSpacing:"0.14em", textTransform:"uppercase", color:c, borderBottom:"1px solid rgba(255,255,255,0.15)", paddingBottom:3, marginBottom:8, marginTop:16 }}>{children}</div>;
  const MH = ({ children }) => <div style={{ fontSize:"0.62rem", fontWeight:800, letterSpacing:"0.15em", textTransform:"uppercase", color:ACCENT, borderBottom:`2px solid ${ACCENT}`, paddingBottom:4, marginBottom:10, marginTop:20 }}>{children}</div>;
  return (
    <div style={{ background:"#fff", display:"grid", gridTemplateColumns:"240px 1fr", overflow:"hidden" }}>
      <div style={{ background:"linear-gradient(180deg,#0f172a,#1e3a5f)", padding:"2rem 1.5rem", color:"#fff" }}>
        <h1 style={{ fontSize:"1.3rem", fontWeight:800, color:"#fff", letterSpacing:"-0.02em", lineHeight:1.2, marginBottom:4 }}>{p.fullName||"Your Name"}</h1>
        <div style={{ fontSize:"0.72rem", color:"#93c5fd", fontWeight:600, marginBottom:16 }}>{(data?.experience||[])[0]?.jobTitle||"Professional"}</div>
        <SH>Contact</SH>
        {[["✉", p.email],["✆", p.phoneNumber],["⊙", p.location],["in", p.linkedin],["⌥", p.gitHub],["⊕", p.portfolio]].filter(([,v])=>v).map(([icon,val],i)=>(
          <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:6, marginBottom:5, fontSize:"0.68rem", color:"#e2e8f0", wordBreak:"break-all" }}><span style={{ opacity:0.6, flexShrink:0 }}>{icon}</span>{val}</div>
        ))}
        {skillDefs.length > 0 && (<><SH>Skills</SH>{skillDefs.map(d=>(
          <div key={d.key} style={{ marginBottom:10 }}>
            <div style={{ fontSize:"0.6rem", fontWeight:700, color:"#bfdbfe", marginBottom:4 }}>{d.label}</div>
            <div>{sk[d.key].map((s,i)=><span key={i} style={{ display:"inline-block", fontSize:"0.65rem", fontWeight:600, padding:"2px 7px", background:"rgba(255,255,255,0.12)", color:"#e0f2fe", margin:"2px 2px 2px 0", borderRadius:3 }}>{s}</span>)}</div>
          </div>
        ))}</>)}
        {(data?.languages||[]).length > 0 && (<><SH>Languages</SH><div>{data.languages.map((l,i)=><span key={i} style={{ display:"inline-block", fontSize:"0.65rem", padding:"2px 7px", background:"rgba(255,255,255,0.1)", color:"#e0f2fe", margin:"2px 2px 2px 0", borderRadius:3 }}>{l.name}</span>)}</div></>)}
        {(data?.interests||[]).length > 0 && (<><SH>Interests</SH><div>{data.interests.map((l,i)=><span key={i} style={{ display:"inline-block", fontSize:"0.65rem", padding:"2px 7px", background:"rgba(255,255,255,0.1)", color:"#e0f2fe", margin:"2px 2px 2px 0", borderRadius:3 }}>{l.name}</span>)}</div></>)}
      </div>
      <div style={{ padding:"2rem 2rem 2.5rem" }}>
        {data?.summary && (<><MH>Career Objective</MH><p style={{ fontSize:"0.8rem", lineHeight:1.78, color:"#374151" }}>{data.summary}</p></>)}
        {(data?.experience||[]).length > 0 && (<><MH>Experience</MH>{data.experience.map((exp,i)=>(
          <div key={i} style={{ marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:4 }}>
              <div><div style={{ fontWeight:700, fontSize:"0.85rem", color:"#111827" }}>{exp.jobTitle}</div><div style={{ fontSize:"0.75rem", color:ACCENT, fontWeight:600, marginTop:2 }}>{[exp.company,exp.location].filter(Boolean).join(" · ")}</div></div>
              <div style={{ fontSize:"0.72rem", color:"#6b7280" }}>{exp.duration}</div>
            </div>
            {exp.responsibility && <p style={{ fontSize:"0.76rem", lineHeight:1.72, color:"#4b5563", marginTop:5 }}>{exp.responsibility}</p>}
          </div>
        ))}</>)}
        {(data?.education||[]).length > 0 && (<><MH>Education</MH>{data.education.map((edu,i)=>(
          <div key={i} style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:4 }}>
              <div><div style={{ fontWeight:700, fontSize:"0.85rem", color:"#111827" }}>{edu.degree}</div><div style={{ fontSize:"0.75rem", color:ACCENT, fontWeight:600, marginTop:2 }}>{[edu.university,edu.location].filter(Boolean).join(" · ")}</div></div>
              <div style={{ fontSize:"0.72rem", color:"#6b7280" }}>{edu.graduationYear}</div>
            </div>
          </div>
        ))}</>)}
        {(data?.projects||[]).length > 0 && (<><MH>Projects</MH>{data.projects.map((proj,i)=>(
          <div key={i} style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontWeight:700, fontSize:"0.85rem", color:"#111827" }}>{proj.title}</span>
              {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noreferrer" style={{ fontSize:"0.7rem", color:ACCENT, fontWeight:600 }}>GitHub ↗</a>}
            </div>
            {proj.description && <p style={{ fontSize:"0.76rem", lineHeight:1.7, color:"#4b5563", marginTop:3 }}>{proj.description}</p>}
          </div>
        ))}</>)}
        {(data?.certifications||[]).length > 0 && (<><MH>Certifications</MH>{data.certifications.map((c,i)=><div key={i} style={{ marginBottom:8 }}><div style={{ fontWeight:700, fontSize:"0.84rem", color:"#111827" }}>{c.title}</div>{c.issuingOrganization&&<div style={{ fontSize:"0.75rem", color:"#6b7280" }}>{c.issuingOrganization}{c.year?` · ${c.year}`:""}</div>}</div>)}</>)}
        {(data?.achievements||[]).length > 0 && (<><MH>Achievements</MH>{data.achievements.map((a,i)=><div key={i} style={{ marginBottom:8 }}><div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ fontWeight:700, fontSize:"0.84rem", color:"#111827" }}>{a.title}</span><span style={{ fontSize:"0.73rem", color:"#6b7280" }}>{a.year}</span></div>{a.extraInformation&&<p style={{ fontSize:"0.77rem", color:"#4b5563", marginTop:2 }}>{a.extraInformation}</p>}</div>)}</>)}
        <div style={{ marginTop:"auto", paddingTop:24, fontSize:"0.55rem", opacity:0.2, letterSpacing:"0.08em", fontWeight:700 }}>AI RESUME MAKER · {new Date().getFullYear()}</div>
      </div>
    </div>
  );
};

const TEMPLATES = [
  { id:"t1", label:"Blue Gradient",  desc:"Modern colored header",  preview: ResumeT1 },
  { id:"t2", label:"Classic",        desc:"Clean black & white",     preview: ResumeT2 },
  { id:"t3", label:"Modern Sidebar", desc:"Dark sidebar layout",     preview: ResumeT3 },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
const ResumePreview = ({ data, onBack }) => {
  const [selected, setSelected] = useState("t1");
  const ActivePreview = TEMPLATES.find(t => t.id === selected)?.preview || ResumeT1;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDownload = () => {
    const builder = BUILDERS[selected];
    if (!builder) return;
    const html = builder(data);
    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
  };

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", minHeight:"100vh", background:"var(--page-bg, #eef0f5)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--navbar-bg:rgba(255,255,255,0.93);--page-bg:#eef0f5;--card-bg:#fff;--label-color:rgba(0,0,0,0.45);--text-primary:#111827}
        [data-theme="dark"]{--navbar-bg:rgba(10,10,15,0.88);--page-bg:#0f0f18;--card-bg:#16161f;--label-color:rgba(255,255,255,0.45);--text-primary:#eeeef5;--b3:rgba(255,255,255,0.08)}
        .grad-text{background:linear-gradient(125deg,#1a56db,#1e40af);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .dl-btn{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(125deg,#1a56db,#1e40af)!important;border:none!important;color:#fff!important;font-weight:700!important;cursor:pointer;border-radius:8px!important;transition:transform 0.18s,box-shadow 0.18s!important;font-family:'Plus Jakarta Sans',sans-serif!important}
        .dl-btn:hover{transform:translateY(-2px)!important;box-shadow:0 8px 24px rgba(26,86,219,0.35)!important}
        .edit-btn{font-size:0.8rem;font-weight:600;padding:0.42rem 0.9rem;border-radius:7px;cursor:pointer;background:transparent;border:1px solid var(--b3,rgba(0,0,0,0.12));color:var(--text-primary,#374151);transition:opacity 0.15s;font-family:'Plus Jakarta Sans',sans-serif}
        .edit-btn:hover{opacity:0.7}
        .tpl-card{border-radius:10px;cursor:pointer;overflow:hidden;transition:transform 0.2s,box-shadow 0.2s;border:2px solid transparent}
        .tpl-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.12)}
        .tpl-card.active{border-color:#1a56db;box-shadow:0 0 0 3px rgba(26,86,219,0.15)}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both}
      `}</style>

      {/* NAVBAR */}
      <nav style={{ position:"sticky", top:0, zIndex:100, backdropFilter:"blur(16px)", background:"var(--navbar-bg)", borderBottom:"1px solid var(--b3,rgba(0,0,0,0.07))" }}>
        <div style={{ maxWidth:960, margin:"0 auto", padding:"0 1.25rem", height:58, display:"flex", alignItems:"center", position:"relative" }}>
          <div style={{ fontWeight:800, fontSize:"1rem", letterSpacing:"-0.02em" }}>Resume<span className="grad-text">AI</span></div>
          <div style={{ position:"absolute", left:"50%", transform:"translateX(-50%)", fontSize:"0.85rem", fontWeight:600, opacity:0.38 }}>📄 Resume Preview</div>
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
            <button className="dl-btn" onClick={handleDownload} style={{ padding:"0.5rem 1.1rem", fontSize:"0.8rem" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 3v13M5 16l7 7 7-7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 20h18" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>
              Download PDF
            </button>
            <button className="edit-btn" onClick={onBack}>← Edit</button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth:960, margin:"0 auto", padding:"2rem 1.25rem 5rem" }}>
        {/* TEMPLATE SWITCHER */}
        <div style={{ marginBottom:"1.5rem" }}>
          <p style={{ fontSize:"0.72rem", fontWeight:700, color:"var(--label-color)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"0.75rem" }}>Choose Template</p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => setSelected(t.id)}
                className={`tpl-card ${selected === t.id ? "active" : ""}`}
                style={{ background:"var(--card-bg, #fff)", padding:"0.65rem 1.2rem", display:"flex", alignItems:"center", gap:10, border: selected===t.id ? "2px solid #1a56db" : "2px solid var(--b3, rgba(0,0,0,0.08))", borderRadius:10, cursor:"pointer" }}>
                <div style={{ width:28, height:28, borderRadius:6, overflow:"hidden", flexShrink:0,
                  background: t.id==="t1" ? "linear-gradient(135deg,#1a56db,#1e40af)"
                             : t.id==="t2" ? "#111827"
                             : "linear-gradient(135deg,#0f172a,#1e3a5f)" }} />
                <div style={{ textAlign:"left" }}>
                  <div style={{ fontSize:"0.82rem", fontWeight:700, color: selected===t.id ? "#1a56db" : "var(--text-primary, #111827)" }}>{t.label}</div>
                  <div style={{ fontSize:"0.7rem", color:"var(--desc-color,rgba(0,0,0,0.45))", opacity:1 }}>{t.desc}</div>
                </div>
                {selected === t.id && (
                  <div style={{ marginLeft:4, width:18, height:18, borderRadius:"50%", background:"#1a56db", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* RESUME PAPER */}
        <div className="fade-up" style={{ background:"#fff", borderRadius:12, boxShadow:"0 8px 48px rgba(0,0,0,0.1)", overflow:"hidden" }}>
          <ActivePreview data={data} />
        </div>

        {/* BOTTOM BUTTONS */}
        <div style={{ display:"flex", justifyContent:"center", gap:10, marginTop:24 }}>
          <button className="edit-btn" onClick={onBack} style={{ fontSize:"0.875rem", padding:"0.72rem 1.5rem", borderRadius:9 }}>← Back to Edit</button>
          <button className="dl-btn" onClick={handleDownload} style={{ fontSize:"0.9rem", padding:"0.72rem 2rem" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3v13M5 16l7 7 7-7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 20h18" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>
            Save as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;