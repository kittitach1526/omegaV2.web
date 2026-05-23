// ─────────────────────────────────────────────
//  components/index.jsx
//  Shared UI components ใช้ร่วมกันหลายหน้า
//  แก้ style / animation ของส่วน UI ได้ที่นี่
// ─────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { MONO, RANK_COLOR, STATUS_CFG } from "../constants.js";

// ─── Background Particle Canvas ───────────────
export function BgCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 90 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.8 + 0.2,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.5 + 0.1,
      col: ["#00f5ff", "#a259ff", "#ff2d78"][Math.floor(Math.random() * 3)],
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => {
        p.x = (p.x + p.vx + c.width)  % c.width;
        p.y = (p.y + p.vy + c.height) % c.height;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.col + Math.floor(p.a * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return (
    <canvas ref={ref} style={{
      position: "fixed", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 0,
    }} />
  );
}

// ─── Grid Background Overlay ──────────────────
export function GridBg() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
      backgroundImage: "linear-gradient(#00f5ff07 1px,transparent 1px),linear-gradient(90deg,#00f5ff07 1px,transparent 1px)",
      backgroundSize: "40px 40px",
    }} />
  );
}

// ─── Glitch Text ──────────────────────────────
/** ใช้สำหรับ title ใหญ่ที่ต้องการ glitch effect */
export function Glitch({ text, size = 64, color = "#fff" }) {
  const [g, setG] = useState(false);
  useEffect(() => {
    const t = setInterval(() => {
      setG(true);
      setTimeout(() => setG(false), 110);
    }, 2800 + Math.random() * 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{
      position: "relative", display: "inline-block",
      fontSize: size, fontWeight: 900, fontFamily: MONO, color,
      letterSpacing: 4,
      textShadow: g ? "3px 0 #ff2d78,-3px 0 #00f5ff" : `0 0 40px ${color}60`,
      transition: "text-shadow 0.05s",
    }}>
      {g && <span style={{ position:"absolute", top:0, left:3,  color:"#ff2d78", opacity:0.7, pointerEvents:"none", userSelect:"none" }}>{text}</span>}
      {g && <span style={{ position:"absolute", top:0, left:-3, color:"#00f5ff", opacity:0.7, pointerEvents:"none", userSelect:"none" }}>{text}</span>}
      {text}
    </span>
  );
}

// ─── Animated Counter ─────────────────────────
/** นับตัวเลขขึ้นเมื่อ element เข้ามาใน viewport */
export function Counter({ target, dur = 1800 }) {
  const [val, setVal] = useState(0);
  const done = useRef(false);
  const ref  = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        const t0 = performance.now();
        const tick = now => {
          const p = Math.min((now - t0) / dur, 1);
          setVal(Math.floor(p * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, dur]);
  return <span ref={ref}>{val.toLocaleString()}</span>;
}

// ─── Corner Bracket (Landing page decoration) ─
export function Corner({ t, l, r, b }) {
  const pos = t && l ? { top: 28, left: 28 }
            : t && r ? { top: 28, right: 28 }
            : b && l ? { bottom: 28, left: 28 }
            :          { bottom: 28, right: 28 };
  return (
    <div style={{
      position: "absolute", width: 52, height: 52,
      borderTop:    t ? "2px solid #00f5ff" : "none",
      borderBottom: b ? "2px solid #00f5ff" : "none",
      borderLeft:   l ? "2px solid #00f5ff" : "none",
      borderRight:  r ? "2px solid #00f5ff" : "none",
      ...pos,
    }} />
  );
}

// ─── Toast Notification ───────────────────────
/** แสดง popup แจ้งเตือนมุมขวาบน แล้วหายไปเอง */
export function Toast({ msg, type, onDone }) {
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => {
      setVis(false);
      setTimeout(onDone, 400);
    }, 2200);
    return () => clearTimeout(t);
  }, []);
  const col = type === "success" ? "#39ff14" : type === "error" ? "#ff2d78" : "#00f5ff";
  return (
    <div style={{
      position: "fixed", top: 24, right: 24, zIndex: 999,
      background: "#0d0d22", border: `1px solid ${col}`, borderRadius: 6,
      padding: "12px 20px", fontFamily: MONO, fontSize: 11, color: col, letterSpacing: 2,
      boxShadow: `0 0 24px ${col}60`,
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(-12px)",
      transition: "all 0.4s ease",
    }}>
      {type === "success" ? "✓" : type === "error" ? "✗" : "ℹ"} {msg}
    </div>
  );
}

// ─── Navigation Bar ───────────────────────────
/** Top nav bar ใช้ร่วมกันระหว่าง RosterPage และ LeaderboardPage */
export function NavBar({ page, setPage, onBack }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
      <button onClick={onBack}
        onMouseEnter={e => { e.currentTarget.style.color = "#00f5ff"; e.currentTarget.style.borderColor = "#00f5ff"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "#555";    e.currentTarget.style.borderColor = "#1a1a3a"; }}
        style={{
          background: "transparent", border: "1px solid #1a1a3a", color: "#555",
          borderRadius: 4, padding: "6px 14px", cursor: "pointer", fontSize: 9,
          letterSpacing: 2, fontFamily: MONO, transition: "all 0.2s",
        }}>← HOME</button>

      <div style={{ display: "flex", gap: 4 }}>
        {[["roster", "ROSTER"], ["leaderboard", "LEADERBOARD"]].map(([v, l]) => (
          <button key={v} onClick={() => setPage(v)} style={{
            background: page === v ? "#00f5ff18" : "transparent",
            border: `1px solid ${page === v ? "#00f5ff" : "#1a1a3a"}`,
            color: page === v ? "#00f5ff" : "#555",
            borderRadius: 4, padding: "6px 16px", cursor: "pointer",
            fontSize: 10, letterSpacing: 2, fontFamily: MONO, transition: "all 0.2s",
          }}>{l}</button>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{
          width: 7, height: 7, borderRadius: "50%", background: "#39ff14",
          boxShadow: "0 0 10px #39ff14", animation: "blink 1.5s infinite",
        }} />
        <span style={{ fontSize: 9, color: "#39ff1488", letterSpacing: 2, fontFamily: MONO }}>SYSTEM ONLINE</span>
      </div>
    </div>
  );
}

// ─── Rank Badge ───────────────────────────────
export function RankBadge({ rank }) {
  const c = RANK_COLOR[rank] || "#888";
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: 1, color: c,
      border: `1px solid ${c}44`, background: c + "15",
      borderRadius: 3, padding: "2px 6px",
    }}>{rank}</span>
  );
}

// ─── Stat Progress Bar ────────────────────────
export function StatBar({ label, value, max, color }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW((value / max) * 100), 140);
    return () => clearTimeout(t);
  }, [value, max]);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: "#666", letterSpacing: 1 }}>{label.toUpperCase()}</span>
        <span style={{ fontSize: 11, color, fontFamily: MONO, fontWeight: 700 }}>{value.toLocaleString()}</span>
      </div>
      <div style={{ height: 3, background: "#1a1a3a", borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${w}%`,
          background: `linear-gradient(90deg,${color}88,${color})`,
          borderRadius: 2, transition: "width 0.9s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: `0 0 8px ${color}`,
        }} />
      </div>
    </div>
  );
}

// ─── Member Card (Roster list item) ──────────
export function MemberCard({ member: m, index, selected, onClick }) {
  const [hov, setHov] = useState(false);
  const st = STATUS_CFG[m.status];
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative", cursor: "pointer",
        background: selected
          ? `linear-gradient(135deg,${m.color}22 0%,#0a0a1a 100%)`
          : hov ? "#0f0f2a" : "#080818",
        border: `1px solid ${selected ? m.color : hov ? m.color + "88" : "#1a1a3a"}`,
        borderRadius: 8, padding: "14px 16px",
        transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: selected
          ? `0 0 24px ${m.color}40,inset 0 0 24px ${m.color}08`
          : hov ? `0 0 12px ${m.color}30` : "none",
        transform: selected ? "translateX(4px)" : hov ? "translateX(2px)" : "none",
        animation: `slideIn 0.4s ease ${index * 0.05}s both`,
      }}>
      {selected && (
        <div style={{
          position: "absolute", left: 0, top: "20%", bottom: "20%",
          width: 3, borderRadius: "0 4px 4px 0",
          background: m.color, boxShadow: `0 0 12px ${m.color}`,
        }} />
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Avatar */}
        <div style={{
          width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
          background: `linear-gradient(135deg,${m.color}44,${m.color}11)`,
          border: `2px solid ${m.color}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 800, color: m.color, fontFamily: MONO,
          boxShadow: `0 0 16px ${m.color}60`,
        }}>{m.avatar}</div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <span style={{ color: "#e8e8ff", fontWeight: 700, fontSize: 14, fontFamily: MONO }}>{m.name}</span>
            <div style={{
              width: 6, height: 6, borderRadius: "50%", background: st.color,
              boxShadow: st.pulse ? `0 0 8px ${st.color}` : "none",
              animation: st.pulse ? "blink 1.5s infinite" : "none",
            }} />
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <RankBadge rank={m.rank} />
            <span style={{ fontSize: 10, color: "#555", fontFamily: MONO }}>// {m.role}</span>
          </div>
        </div>

        {/* K/D */}
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: m.color, fontFamily: MONO }}>{m.kd.toFixed(1)}</div>
          <div style={{ fontSize: 9, color: "#555", letterSpacing: 1 }}>K/D</div>
        </div>
      </div>
    </div>
  );
}
