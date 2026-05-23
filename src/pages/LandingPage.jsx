// ─────────────────────────────────────────────
//  pages/LandingPage.jsx
//  หน้าต้อนรับ — boot sequence + hero title
//  แก้ชื่อทีม, tagline, สถิติ ได้ที่นี่
// ─────────────────────────────────────────────

import { useState, useEffect } from "react";
import { INIT_MEMBERS, MONO } from "../constants.js";
import { Glitch, Counter, Corner } from "../components/index.jsx";

// ─── Boot sequence lines — แก้ข้อความ terminal ─
const BOOT_LINES = [
  "> INITIALIZING PHANTOM.PROTOCOL ...",
  "> LOADING OPERATIVE DATABASE ...",
  "> DECRYPTING MEMBER RECORDS ...",
  "> NEURAL LINK ESTABLISHED ...",
  "> ALL SYSTEMS NOMINAL ■",
];

// ─── Enter button ─────────────────────────────
function EnterBtn({ onClick }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, outline: "none" }}>
      <div style={{
        padding: "16px 60px",
        border: `1px solid ${h ? "#00f5ff" : "#00f5ff55"}`,
        color: h ? "#05050f" : "#00f5ff",
        fontSize: 11, fontWeight: 700, letterSpacing: 8, fontFamily: MONO,
        background: h ? "#00f5ff" : "transparent",
        transition: "all 0.2s ease",
        boxShadow: h ? "0 0 50px #00f5ff80" : "0 0 20px #00f5ff30",
      }}>
        {h ? "▶  INITIATING ..." : "[ ACCESS ROSTER ]"}
      </div>
    </button>
  );
}

// ─── Main Landing Page ────────────────────────
export default function LandingPage({ onEnter }) {
  const [phase,   setPhase]   = useState(0);   // 0 = boot, 1 = show hero
  const [lines,   setLines]   = useState([]);
  const [exiting, setExiting] = useState(false);

  // Boot sequence animation
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setLines(l => [...l, BOOT_LINES[i]]);
      i++;
      if (i >= BOOT_LINES.length) {
        clearInterval(t);
        setTimeout(() => setPhase(1), 500);
      }
    }, 360);
    return () => clearInterval(t);
  }, []);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(onEnter, 700);
  };

  // สถิติที่แสดงบน landing — แก้ได้
  const stats = [
    ["MEMBERS",  INIT_MEMBERS.length],
    ["TOTAL KILLS", INIT_MEMBERS.reduce((a, m) => a + m.kills, 0)],
    ["AVG K/D",     +(INIT_MEMBERS.reduce((a, m) => a + m.kd, 0) / INIT_MEMBERS.length).toFixed(1)],
    ["ACTIVE NOW",  INIT_MEMBERS.filter(m => m.status !== "offline").length],
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50, background: "#05050f",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: exiting ? 0 : 1, transition: "opacity 0.7s ease",
    }}>
      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(#00f5ff06 1px,transparent 1px),linear-gradient(90deg,#00f5ff06 1px,transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      {/* Corner brackets */}
      <Corner t l /><Corner t r /><Corner b l /><Corner b r />

      {/* Boot terminal (top-left) */}
      <div style={{
        position: "absolute", top: 60, left: 60, right: 60,
        fontFamily: MONO, fontSize: 11, color: "#00f5ff66", letterSpacing: 2,
      }}>
        {lines.map((l, i) => (
          <div key={i} style={{ marginBottom: 4, animation: "fadeUp 0.3s ease both" }}>{l}</div>
        ))}
      </div>

      {/* Hero content */}
      {phase >= 1 && (
        <div style={{ textAlign: "center", position: "relative", zIndex: 2, animation: "fadeUp 0.9s cubic-bezier(0.2,0,0,1) both" }}>

          {/* Squad tag — แก้ชื่อทีมที่นี่ */}
          <div style={{
            fontSize: 10, letterSpacing: 8, color: "#00f5ff88", fontFamily: MONO, marginBottom: 24,
            borderTop: "1px solid #00f5ff33", borderBottom: "1px solid #00f5ff33",
            padding: "7px 32px", display: "inline-block",
          }}>ELITE GAMING SQUAD</div>

          {/* Title — แก้ชื่อทีม 2 บรรทัดที่นี่ */}
          <div style={{ lineHeight: 1.05, marginBottom: 36 }}>
            <div><Glitch text="OMEGA" size={82} color="#ffffff" /></div>
          <div><Glitch text="OFFICIAL WEBSITE" size={52} color="#00f5ff" /></div>
          </div>

          {/* Tagline — แก้ได้ */}
          <div style={{ fontSize: 12, color: "#ffffff44", letterSpacing: 4, fontFamily: MONO, marginBottom: 52 }}>
            PLAY WITH ME IF YOU DARE
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 48, justifyContent: "center", marginBottom: 64 }}>
            {stats.map(([label, val]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 30, fontWeight: 900, color: "#00f5ff", fontFamily: MONO, textShadow: "0 0 24px #00f5ff80" }}>
                  {val > 99 ? <Counter target={val} /> : val}
                </div>
                <div style={{ fontSize: 9, color: "#ffffff33", letterSpacing: 3, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>

          <EnterBtn onClick={handleEnter} />
        </div>
      )}

      {/* Footer */}
      <div style={{
        position: "absolute", bottom: 24, left: 0, right: 0, textAlign: "center",
        fontSize: 9, color: "#ffffff1a", letterSpacing: 3, fontFamily: MONO,
      }}>
        PHANTOM.PROTOCOL v2.4.1 // CLASSIFIED
      </div>
    </div>
  );
}
