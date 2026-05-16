import { useState, useEffect, useRef } from "react";

/* ── DATA ── */
const INIT = [
  { id:1, name:"ShadowByte",   rank:"Grand Master", role:"Sniper",  kills:9842, kd:4.2, status:"online",  avatar:"SB", color:"#00f5ff", game:"Valorant",  wins:312 },
  { id:2, name:"NeonViper",    rank:"Challenger",   role:"Rusher",  kills:7631, kd:3.8, status:"in-game", avatar:"NV", color:"#ff2d78", game:"CS2",       wins:287 },
  { id:3, name:"VoidWalker",   rank:"Diamond",      role:"Support", kills:5204, kd:2.9, status:"online",  avatar:"VW", color:"#a259ff", game:"Apex",      wins:198 },
  { id:4, name:"GhostKing_X",  rank:"Platinum",     role:"Tank",    kills:4417, kd:2.4, status:"offline", avatar:"GK", color:"#39ff14", game:"Overwatch", wins:154 },
  { id:5, name:"CryptoAce",    rank:"Grand Master", role:"Flanker", kills:8103, kd:3.5, status:"in-game", avatar:"CA", color:"#ff6b35", game:"Valorant",  wins:276 },
  { id:6, name:"PixelReaper",  rank:"Master",       role:"IGL",     kills:6722, kd:3.1, status:"online",  avatar:"PR", color:"#00f5ff", game:"CS2",       wins:231 },
  { id:7, name:"StormBreaker", rank:"Diamond",      role:"Entry",   kills:5980, kd:2.7, status:"offline", avatar:"SB", color:"#ff2d78", game:"Apex",      wins:176 },
  { id:8, name:"IcePhantom",   rank:"Challenger",   role:"Lurker",  kills:7290, kd:4.0, status:"online",  avatar:"IP", color:"#a259ff", game:"Valorant",  wins:298 },
];
const RANKS   = ["Challenger","Grand Master","Master","Diamond","Platinum","Gold"];
const ROLES   = ["Sniper","Rusher","Support","Tank","Flanker","IGL","Entry","Lurker","Scout"];
const GAMES   = ["Valorant","CS2","Apex","Overwatch","Fortnite","PUBG"];
const PALETTE = ["#00f5ff","#ff2d78","#a259ff","#39ff14","#ff6b35","#ffd700","#ff4444","#00ff88"];
const STATUSES = ["online","in-game","offline"];
const RANK_W  = { Challenger:6,"Grand Master":5,Master:4,Diamond:3,Platinum:2,Gold:1 };
const STATUS  = {
  online:  { label:"HEAD",  color:"#39ff14", pulse:true  },
  "in-game":{ label:"SUPPORT", color:"#ff6b35", pulse:true  },
  offline: { label:"MEMBER", color:"#444",    pulse:false },
};
const M = "'Press Start 2P',system-ui";

function av(name) {
  const p = name.replace(/_/g," ").split(" ");
  return (p.length >= 2 ? p[0][0]+p[1][0] : name.slice(0,2)).toUpperCase();
}

/* ── BG CANVAS ── */
function BgCanvas() {
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
      col: ["#00f5ff","#a259ff","#ff2d78"][Math.floor(Math.random() * 3)],
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
  return <canvas ref={ref} style={{ position:"fixed", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0 }} />;
}

/* ── GLITCH ── */
function Glitch({ text, size = 64, color = "#fff" }) {
  const [g, setG] = useState(false);
  useEffect(() => {
    const t = setInterval(() => { setG(true); setTimeout(() => setG(false), 110); }, 2800 + Math.random() * 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{ position:"relative", display:"inline-block", fontSize:size, fontWeight:900,
      fontFamily:M, color, letterSpacing:4,
      textShadow: g ? "3px 0 #ff2d78,-3px 0 #00f5ff" : `0 0 40px ${color}60`,
      transition:"text-shadow 0.05s" }}>
      {g && <span style={{ position:"absolute", top:0, left:3, color:"#ff2d78", opacity:0.7, pointerEvents:"none", userSelect:"none" }}>{text}</span>}
      {g && <span style={{ position:"absolute", top:0, left:-3, color:"#00f5ff", opacity:0.7, pointerEvents:"none", userSelect:"none" }}>{text}</span>}
      {text}
    </span>
  );
}

/* ── COUNTER ── */
function Counter({ target, dur = 1800 }) {
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

/* ── CORNER BRACKET ── */
function Corner({ t, l, r, b }) {
  const pos = t&&l ? { top:28, left:28 } : t&&r ? { top:28, right:28 } : b&&l ? { bottom:28, left:28 } : { bottom:28, right:28 };
  return (
    <div style={{
      position:"absolute", width:52, height:52,
      borderTop:    t ? "2px solid #00f5ff" : "none",
      borderBottom: b ? "2px solid #00f5ff" : "none",
      borderLeft:   l ? "2px solid #00f5ff" : "none",
      borderRight:  r ? "2px solid #00f5ff" : "none",
      ...pos,
    }} />
  );
}

/* ── TOAST ── */
function Toast({ msg, type, onDone }) {
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => { setVis(false); setTimeout(onDone, 400); }, 2200);
    return () => clearTimeout(t);
  }, []);
  const col = type === "success" ? "#39ff14" : type === "error" ? "#ff2d78" : "#00f5ff";
  return (
    <div style={{ position:"fixed", top:24, right:24, zIndex:999,
      background:"#0d0d22", border:`1px solid ${col}`, borderRadius:6,
      padding:"12px 20px", fontFamily:M, fontSize:11, color:col, letterSpacing:2,
      boxShadow:`0 0 24px ${col}60`,
      opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(-12px)",
      transition:"all 0.4s ease" }}>
      {type === "success" ? "✓" : type === "error" ? "✗" : "ℹ"} {msg}
    </div>
  );
}

/* ── GRID BG ── */
const GridBg = () => (
  <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
    backgroundImage:"linear-gradient(#00f5ff07 1px,transparent 1px),linear-gradient(90deg,#00f5ff07 1px,transparent 1px)",
    backgroundSize:"40px 40px" }} />
);

/* ── NAV BAR ── */
function NavBar({ page, setPage, onBack }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24, flexWrap:"wrap" }}>
      <button onClick={onBack}
        onMouseEnter={e => { e.currentTarget.style.color="#00f5ff"; e.currentTarget.style.borderColor="#00f5ff"; }}
        onMouseLeave={e => { e.currentTarget.style.color="#555";    e.currentTarget.style.borderColor="#1a1a3a"; }}
        style={{ background:"transparent", border:"1px solid #1a1a3a", color:"#555",
          borderRadius:4, padding:"6px 14px", cursor:"pointer", fontSize:9,
          letterSpacing:2, fontFamily:M, transition:"all 0.2s" }}>← HOME</button>
      <div style={{ display:"flex", gap:4 }}>
        {[["roster","MEMBERS"],["leaderboard","LEADERBOARD"]].map(([v, l]) => (
          <button key={v} onClick={() => setPage(v)} style={{
            background: page===v ? "#00f5ff18" : "transparent",
            border: `1px solid ${page===v ? "#00f5ff" : "#1a1a3a"}`,
            color: page===v ? "#00f5ff" : "#555",
            borderRadius:4, padding:"6px 16px", cursor:"pointer", fontSize:10,
            letterSpacing:2, fontFamily:M, transition:"all 0.2s" }}>{l}</button>
        ))}
      </div>
      <div style={{ flex:1 }} />
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        <div style={{ width:7, height:7, borderRadius:"50%", background:"#39ff14",
          boxShadow:"0 0 10px #39ff14", animation:"blink 1.5s infinite" }} />
        <span style={{ fontSize:9, color:"#39ff1488", letterSpacing:2, fontFamily:M }}>SYSTEM ONLINE</span>
      </div>
    </div>
  );
}

/* ── RANK BADGE ── */
function RankBadge({ rank }) {
  const map = { Challenger:"#00f5ff","Grand Master":"#ff2d78",Master:"#a259ff",Diamond:"#39f4ff",Platinum:"#b5d5ff",Gold:"#ffd700" };
  const c = map[rank] || "#888";
  return (
    <span style={{ fontSize:10, fontWeight:700, letterSpacing:1, color:c,
      border:`1px solid ${c}44`, background:c+"15", borderRadius:3, padding:"2px 6px" }}>{rank}</span>
  );
}

/* ── STAT BAR ── */
function StatBar({ label, value, max, color }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW((value / max) * 100), 140); return () => clearTimeout(t); }, [value, max]);
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
        <span style={{ fontSize:10, color:"#666", letterSpacing:1 }}>{label.toUpperCase()}</span>
        <span style={{ fontSize:11, color, fontFamily:M, fontWeight:700 }}>{value.toLocaleString()}</span>
      </div>
      <div style={{ height:3, background:"#1a1a3a", borderRadius:2, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${w}%`,
          background:`linear-gradient(90deg,${color}88,${color})`,
          borderRadius:2, transition:"width 0.9s cubic-bezier(0.4,0,0.2,1)", boxShadow:`0 0 8px ${color}` }} />
      </div>
    </div>
  );
}

/* ── MEMBER CARD ── */
function MemberCard({ member: m, index, selected, onClick }) {
  const [hov, setHov] = useState(false);
  const st = STATUS[m.status];
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position:"relative", cursor:"pointer",
        background: selected ? `linear-gradient(135deg,${m.color}22 0%,#0a0a1a 100%)` : hov ? "#0f0f2a" : "#080818",
        border: `1px solid ${selected ? m.color : hov ? m.color+"88" : "#1a1a3a"}`,
        borderRadius:8, padding:"14px 16px", transition:"all 0.22s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: selected ? `0 0 24px ${m.color}40,inset 0 0 24px ${m.color}08` : hov ? `0 0 12px ${m.color}30` : "none",
        transform: selected ? "translateX(4px)" : hov ? "translateX(2px)" : "none",
        animation: `slideIn 0.4s ease ${index * 0.05}s both` }}>
      {selected && <div style={{ position:"absolute", left:0, top:"20%", bottom:"20%", width:3,
        borderRadius:"0 4px 4px 0", background:m.color, boxShadow:`0 0 12px ${m.color}` }} />}
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:44, height:44, borderRadius:"50%", flexShrink:0,
          background:`linear-gradient(135deg,${m.color}44,${m.color}11)`,
          border:`2px solid ${m.color}`, display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:13, fontWeight:800, color:m.color, fontFamily:M, boxShadow:`0 0 16px ${m.color}60` }}>{m.avatar}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
            <span style={{ color:"#e8e8ff", fontWeight:700, fontSize:14, fontFamily:M }}>{m.name}</span>
            <div style={{ width:6, height:6, borderRadius:"50%", background:st.color,
              boxShadow: st.pulse ? `0 0 8px ${st.color}` : "none",
              animation: st.pulse ? "blink 1.5s infinite" : "none" }} />
          </div>
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            <RankBadge rank={m.rank} />
            <span style={{ fontSize:10, color:"#555", fontFamily:M }}>// {m.role}</span>
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:16, fontWeight:800, color:m.color, fontFamily:M }}>{m.kd.toFixed(1)}</div>
          <div style={{ fontSize:9, color:"#555", letterSpacing:1 }}>K/D</div>
        </div>
      </div>
    </div>
  );
}

/* ── FIELD LABEL ── */
const FL = ({ children }) => (
  <div style={{ fontSize:9, color:"#555", letterSpacing:2, marginBottom:5 }}>{children}</div>
);

/* ── MEMBER MODAL (ADD / EDIT) ── */
function MemberModal({ member, onSave, onClose }) {
  const isEdit = !!(member && member.id);
  const blank  = { name:"", rank:"Diamond", role:"Entry", kills:0, kd:1.0, status:"online", color:"#00f5ff", game:"Valorant", wins:0 };
  const [form, setForm] = useState(isEdit ? member : blank);
  const [err,  setErr]  = useState("");

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    const name = (form.name || "").trim();
    if (!name)        { setErr("NAME IS REQUIRED"); return; }
    if (name.length < 3) { setErr("NAME TOO SHORT (MIN 3)"); return; }
    onSave({ ...form, name, avatar: av(name),
      kills: Number(form.kills) || 0,
      kd: parseFloat(form.kd) || 1.0,
      wins: Number(form.wins) || 0,
      id: (isEdit ? member.id : Date.now()),
    });
  };

  const inputStyle = (highlight) => ({
    width:"100%", background:"#0a0a1a",
    border:`1px solid ${highlight ? "#ff2d78" : "#1a1a3a"}`,
    borderRadius:4, padding:"8px 10px", color:"#e8e8ff",
    fontSize:11, letterSpacing:1, outline:"none", fontFamily:M,
  });
  const selStyle = { width:"100%", background:"#0a0a1a", border:"1px solid #1a1a3a",
    borderRadius:4, padding:"8px 10px", color:"#e8e8ff", fontSize:11, fontFamily:M, cursor:"pointer" };
  const btnBase  = { borderRadius:4, padding:"10px", cursor:"pointer", fontSize:10, letterSpacing:2, fontFamily:M, transition:"all 0.2s", border:"none" };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:200, background:"#000000cc",
      display:"flex", alignItems:"center", justifyContent:"center", animation:"fadeUp 0.2s ease" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:"#080818", border:"1px solid #00f5ff44", borderRadius:10,
        padding:28, width:"min(500px,95vw)", position:"relative",
        boxShadow:"0 0 60px #00f5ff20", animation:"modalIn 0.3s cubic-bezier(0.2,0,0,1)", overflow:"hidden" }}>

        <div style={{ position:"absolute", left:0, right:0, height:2, pointerEvents:"none",
          background:"linear-gradient(90deg,transparent,#00f5ff50,transparent)", animation:"scan 3s linear infinite" }} />

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div>
            <div style={{ fontSize:14, fontWeight:900, color:"#fff", letterSpacing:3, fontFamily:M }}>
              {isEdit ? "EDIT OPERATIVE" : "ADD OPERATIVE"}
            </div>
            <div style={{ fontSize:9, color:"#00f5ff55", letterSpacing:2, marginTop:2 }}>// SQUAD MANAGEMENT CONSOLE</div>
          </div>
          <button onClick={onClose}
            onMouseEnter={e => { e.currentTarget.style.color="#ff2d78"; e.currentTarget.style.borderColor="#ff2d78"; }}
            onMouseLeave={e => { e.currentTarget.style.color="#555";    e.currentTarget.style.borderColor="#1a1a3a"; }}
            style={{ background:"transparent", border:"1px solid #1a1a3a", color:"#555",
              borderRadius:4, width:28, height:28, cursor:"pointer", fontSize:14, fontFamily:M,
              display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}>✕</button>
        </div>

        {/* Avatar preview */}
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <div style={{ width:64, height:64, borderRadius:"50%", margin:"0 auto",
            background:`linear-gradient(135deg,${form.color}44,${form.color}11)`,
            border:`2px solid ${form.color}`, display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:18, fontWeight:900, color:form.color, fontFamily:M,
            boxShadow:`0 0 20px ${form.color}60`, transition:"all 0.3s" }}>
            {av(form.name || "??")}
          </div>
        </div>

        {/* Form grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
          <div style={{ gridColumn:"1/-1" }}>
            <FL>OPERATIVE NAME *</FL>
            <input value={form.name} onChange={e => upd("name", e.target.value)}
              placeholder="e.g. ShadowByte"
              style={inputStyle(err && !form.name.trim())} />
            {err && <div style={{ fontSize:9, color:"#ff2d78", marginTop:4, letterSpacing:1 }}>{err}</div>}
          </div>
          <div>
            <FL>RANK</FL>
            <select value={form.rank} onChange={e => upd("rank", e.target.value)} style={selStyle}>
              {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <FL>ROLE</FL>
            <select value={form.role} onChange={e => upd("role", e.target.value)} style={selStyle}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <FL>GAME</FL>
            <select value={form.game} onChange={e => upd("game", e.target.value)} style={selStyle}>
              {GAMES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <FL>STATUS</FL>
            <select value={form.status} onChange={e => upd("status", e.target.value)} style={selStyle}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <FL>K/D RATIO</FL>
            <input type="number" value={form.kd} min={0} max={20} step={0.1}
              onChange={e => upd("kd", e.target.value)} style={inputStyle(false)} />
          </div>
          <div>
            <FL>TOTAL KILLS</FL>
            <input type="number" value={form.kills} min={0}
              onChange={e => upd("kills", e.target.value)} style={inputStyle(false)} />
          </div>
          <div>
            <FL>WINS</FL>
            <input type="number" value={form.wins} min={0}
              onChange={e => upd("wins", e.target.value)} style={inputStyle(false)} />
          </div>
          <div>
            <FL>COLOR TAG</FL>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", paddingTop:4 }}>
              {PALETTE.map(c => (
                <div key={c} onClick={() => upd("color", c)}
                  style={{ width:22, height:22, borderRadius:"50%", background:c, cursor:"pointer",
                    border: `2px solid ${form.color === c ? "#fff" : "transparent"}`,
                    boxShadow: form.color === c ? `0 0 10px ${c}` : "none",
                    transition:"all 0.15s" }} />
              ))}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={onClose}
            onMouseEnter={e => { e.currentTarget.style.borderColor="#555"; e.currentTarget.style.color="#888"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="#1a1a3a"; e.currentTarget.style.color="#555"; }}
            style={{ ...btnBase, flex:1, background:"transparent", border:"1px solid #1a1a3a", color:"#555" }}>
            CANCEL
          </button>
          <button onClick={handleSave}
            onMouseEnter={e => { e.currentTarget.style.background="#00f5ff"; e.currentTarget.style.color="#05050f"; }}
            onMouseLeave={e => { e.currentTarget.style.background="#00f5ff15"; e.currentTarget.style.color="#00f5ff"; }}
            style={{ ...btnBase, flex:2, background:"#00f5ff15", border:"1px solid #00f5ff",
              color:"#00f5ff", boxShadow:"0 0 16px #00f5ff30" }}>
            {isEdit ? "▶ UPDATE OPERATIVE" : "▶ ENLIST OPERATIVE"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── DELETE CONFIRM ── */
function DeleteConfirm({ member: m, onConfirm, onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:200, background:"#000000cc",
      display:"flex", alignItems:"center", justifyContent:"center" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:"#080818", border:"1px solid #ff2d7866", borderRadius:10,
        padding:28, width:"min(360px,90vw)", textAlign:"center",
        boxShadow:"0 0 60px #ff2d7820", animation:"modalIn 0.25s ease" }}>
        <div style={{ fontSize:32, marginBottom:12 }}>⚠</div>
        <div style={{ fontSize:13, fontWeight:900, color:"#ff2d78", letterSpacing:3, fontFamily:M, marginBottom:8 }}>TERMINATE OPERATIVE</div>
        <div style={{ fontSize:11, color:"#888", fontFamily:M, marginBottom:20, letterSpacing:1 }}>
          Remove <span style={{ color:"#fff" }}>{m.name}</span> from the roster?<br />This action cannot be undone.
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={onClose}
            style={{ flex:1, background:"transparent", border:"1px solid #1a1a3a", color:"#555",
              borderRadius:4, padding:"10px", cursor:"pointer", fontSize:10, letterSpacing:2, fontFamily:M }}>
            ABORT
          </button>
          <button onClick={onConfirm}
            onMouseEnter={e => { e.currentTarget.style.background="#ff2d78"; e.currentTarget.style.color="#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background="#ff2d7815"; e.currentTarget.style.color="#ff2d78"; }}
            style={{ flex:1, background:"#ff2d7815", border:"1px solid #ff2d78", color:"#ff2d78",
              borderRadius:4, padding:"10px", cursor:"pointer", fontSize:10, letterSpacing:2, fontFamily:M,
              boxShadow:"0 0 16px #ff2d7830", transition:"all 0.2s" }}>
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── LANDING PAGE ── */
function LandingPage({ onEnter }) {
  const [phase,   setPhase]   = useState(0);
  const [lines,   setLines]   = useState([]);
  const [exiting, setExiting] = useState(false);

  const bootLines = [
    "> INITIALIZING OMEGA SYSTEM ...",
    "> LOADING OPERATIVE DATABASE ...",
    "> DECRYPTING MEMBER RECORDS ...",
    "> NEURAL LINK ESTABLISHED ...",
    "> ALL SYSTEMS START ■",
  ];

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setLines(l => [...l, bootLines[i]]);
      i++;
      if (i >= bootLines.length) { clearInterval(t); setTimeout(() => setPhase(1), 500); }
    }, 360);
    return () => clearInterval(t);
  }, []);

  const handleEnter = () => { setExiting(true); setTimeout(onEnter, 700); };

  const totalKills = INIT.reduce((a, m) => a + m.kills, 0);
  const avgKd      = (INIT.reduce((a, m) => a + m.kd, 0) / INIT.length).toFixed(1);
  const activeNow  = INIT.filter(m => m.status !== "offline").length;

  return (
    <div style={{ position:"fixed", inset:0, zIndex:50, background:"#05050f",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      opacity: exiting ? 0 : 1, transition:"opacity 0.7s ease" }}>

      <div style={{ position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:"linear-gradient(#00f5ff06 1px,transparent 1px),linear-gradient(90deg,#00f5ff06 1px,transparent 1px)",
        backgroundSize:"48px 48px" }} />

      <Corner t l /><Corner t r /><Corner b l /><Corner b r />

      <div style={{ position:"absolute", top:60, left:60, right:60, fontFamily:M, fontSize:11, color:"#00f5ff66", letterSpacing:2 }}>
        {lines.map((l, i) => <div key={i} style={{ marginBottom:4, animation:"fadeUp 0.3s ease both" }}>{l}</div>)}
      </div>

      {phase >= 1 && (
        <div style={{ textAlign:"center", position:"relative", zIndex:2, animation:"fadeUp 0.9s cubic-bezier(0.2,0,0,1) both" }}>
          <div style={{ fontSize:10, letterSpacing:8, color:"#00f5ff88", fontFamily:M, marginBottom:24,
            borderTop:"1px solid #00f5ff33", borderBottom:"1px solid #00f5ff33",
            padding:"7px 32px", display:"inline-block" }}>OFFICIAL WEBSITE</div>

          <div style={{ lineHeight:1.05, marginBottom:36 }}>
            <div><Glitch text="OMEGA" size={82} color="#ffffff" /></div>
            {/* <div><Glitch text="PROTOCOL" size={82} color="#00f5ff" /></div> */}
          </div>

          <div style={{ fontSize:12, color:"#ffffff44", letterSpacing:4, fontFamily:M, marginBottom:52 }}>
            Play with me if you dare...
          </div>

          <div style={{ display:"flex", gap:48, justifyContent:"center", marginBottom:64 }}>
            {[
              ["Members",  INIT.length],
              ["TOTAL KILLS", totalKills],
              ["AVG K/D",     +avgKd],
              ["ACTIVE NOW",  activeNow],
            ].map(([label, val]) => (
              <div key={label} style={{ textAlign:"center" }}>
                <div style={{ fontSize:30, fontWeight:900, color:"#00f5ff", fontFamily:M, textShadow:"0 0 24px #00f5ff80" }}>
                  {val > 99 ? <Counter target={val} /> : val}
                </div>
                <div style={{ fontSize:9, color:"#ffffff33", letterSpacing:3, marginTop:4 }}>{label}</div>
              </div>
            ))}
          </div>

          <LandingBtn onClick={handleEnter} />
        </div>
      )}

      <div style={{ position:"absolute", bottom:24, left:0, right:0, textAlign:"center",
        fontSize:9, color:"#ffffff1a", letterSpacing:3, fontFamily:M }}>
        Sapphxre.DEV // CLASSIFIED
      </div>
    </div>
  );
}

function LandingBtn({ onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background:"transparent", border:"none", cursor:"pointer", padding:0, outline:"none" }}>
      <div style={{ padding:"16px 60px",
        border: `1px solid ${h ? "#00f5ff" : "#00f5ff55"}`,
        color: h ? "#05050f" : "#00f5ff",
        fontSize:11, fontWeight:700, letterSpacing:8, fontFamily:M,
        background: h ? "#00f5ff" : "transparent",
        transition:"all 0.2s ease",
        boxShadow: h ? "0 0 50px #00f5ff80" : "0 0 20px #00f5ff30" }}>
        {h ? "▶  INITIATING ..." : "[ ACCESS ROSTER ]"}
      </div>
    </button>
  );
}

/* ── ROSTER PAGE ── */
function RosterPage({ members, setMembers, setPage, onBack }) {
  const [sel,    setSel]    = useState(members[0]);
  const [filter, setFilter] = useState("all");
  const [sort,   setSort]   = useState("kd");
  const [q,      setQ]      = useState("");
  const [tick,   setTick]   = useState(0);
  const [modal,  setModal]  = useState(null);   // null | "add" | memberObj
  const [delTgt, setDelTgt] = useState(null);
  const [toast,  setToast]  = useState(null);

  useEffect(() => { const t = setInterval(() => setTick(n => n+1), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { if (sel && !members.find(m => m.id === sel.id)) setSel(members[0]); }, [members]);

  const toast$ = (msg, type = "success") => setToast({ msg, type, key: Date.now() });

  const handleSave = data => {
    if (members.find(m => m.id === data.id)) {
      setMembers(ms => ms.map(m => m.id === data.id ? data : m));
      setSel(data);
      toast$("OPERATIVE UPDATED");
    } else {
      setMembers(ms => [...ms, data]);
      setSel(data);
      toast$("OPERATIVE ENLISTED");
    }
    setModal(null);
  };

  const handleDelete = () => {
    setMembers(ms => ms.filter(m => m.id !== delTgt.id));
    toast$(`${delTgt.name} TERMINATED`, "error");
    setDelTgt(null);
    setSel(members.find(m => m.id !== delTgt.id) || null);
  };

  const list = members
    .filter(m => filter === "all" || m.status === filter)
    .filter(m => m.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) =>
      sort === "kd"    ? b.kd - a.kd :
      sort === "kills" ? b.kills - a.kills :
      (RANK_W[b.rank] || 0) - (RANK_W[a.rank] || 0));

  const online = members.filter(m => m.status !== "offline").length;
  const maxK   = Math.max(...members.map(m => m.kills), 1);
  const maxW   = Math.max(...members.map(m => m.wins), 1);

  const filterBtnStyle = (v) => ({
    background: filter===v ? "#00f5ff15" : "transparent",
    border: `1px solid ${filter===v ? "#00f5ff" : "#1a1a3a"}`,
    color: filter===v ? "#00f5ff" : "#555",
    borderRadius:4, padding:"8px 12px", fontSize:10, cursor:"pointer",
    letterSpacing:1, fontFamily:M, transition:"all 0.2s",
  });

  return (
    <div style={{ minHeight:"100vh", background:"#05050f", fontFamily:M, color:"#e8e8ff",
      padding:"24px 20px", position:"relative", animation:"fadeUp 0.5s ease" }}>
      <GridBg />
      <div style={{ position:"relative", zIndex:2, maxWidth:1060, margin:"0 auto" }}>
        <NavBar page="roster" setPage={setPage} onBack={onBack} />

        {/* Title */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:18 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:2 }}>
              <div style={{ width:3, height:28, background:"#00f5ff", boxShadow:"0 0 12px #00f5ff", borderRadius:2 }} />
              <h1 style={{ margin:0, fontSize:22, fontWeight:900, letterSpacing:3, color:"#fff", textShadow:"0 0 30px #00f5ff60" }}>SQUAD ROSTER</h1>
            </div>
            <div style={{ fontSize:9, color:"#00f5ff55", letterSpacing:2, paddingLeft:13 }}>// TACTICAL OPERATIVE DATABASE v2.4.1</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:9, color:"#555", letterSpacing:2, marginBottom:2 }}>ACTIVE</div>
              <div style={{ fontSize:22, fontWeight:800, color:"#39ff14", fontFamily:M, animation:"glow 2s infinite" }}>{online}/{members.length}</div>
            </div>
            <button onClick={() => setModal("add")}
              onMouseEnter={e => { e.currentTarget.style.background="#00f5ff"; e.currentTarget.style.color="#05050f"; }}
              onMouseLeave={e => { e.currentTarget.style.background="#00f5ff15"; e.currentTarget.style.color="#00f5ff"; }}
              style={{ background:"#00f5ff15", border:"1px solid #00f5ff", color:"#00f5ff",
                borderRadius:4, padding:"8px 16px", cursor:"pointer", fontSize:10, letterSpacing:2,
                fontFamily:M, boxShadow:"0 0 16px #00f5ff30", transition:"all 0.2s" }}>+ ENLIST</button>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="SEARCH OPERATIVE..."
            style={{ flex:1, minWidth:160, background:"#0a0a1a", border:"1px solid #1a1a3a",
              borderRadius:4, padding:"8px 12px", color:"#e8e8ff", fontSize:11, letterSpacing:1,
              outline:"none", fontFamily:M }} />
          {[["all","ALL"],["head","HEAD"],["support","SUPPORT"],["member","MEMBER"]].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)} style={filterBtnStyle(v)}>{l}</button>
          ))}
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ background:"#0a0a1a", border:"1px solid #1a1a3a", borderRadius:4,
              color:"#e8e8ff", padding:"8px 12px", fontSize:10, letterSpacing:1, fontFamily:M, cursor:"pointer" }}>
            <option value="kd">SORT: K/D</option>
            <option value="kills">SORT: KILLS</option>
            <option value="rank">SORT: RANK</option>
          </select>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:12 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {list.length === 0 && <div style={{ textAlign:"center", color:"#333", padding:40, fontSize:11, letterSpacing:2 }}>// NO OPERATIVES FOUND</div>}
            {list.map((m, i) => (
              <MemberCard key={m.id} member={m} index={i} selected={sel?.id === m.id} onClick={() => setSel(m)} />
            ))}
          </div>

          {sel && (
            <div key={sel.id} style={{ background:"#080818", border:`1px solid ${sel.color}66`,
              borderRadius:8, padding:20, position:"sticky", top:0, alignSelf:"start",
              animation:"fadeUp 0.3s ease", boxShadow:`0 0 40px ${sel.color}20`, overflow:"hidden" }}>
              <div style={{ position:"absolute", left:0, right:0, height:2, pointerEvents:"none",
                background:`linear-gradient(90deg,transparent,${sel.color}60,transparent)`,
                animation:"scan 3s linear infinite" }} />
              <div style={{ textAlign:"center", marginBottom:16 }}>
                <div style={{ width:72, height:72, borderRadius:"50%", margin:"0 auto 12px",
                  background:`linear-gradient(135deg,${sel.color}44,${sel.color}11)`,
                  border:`3px solid ${sel.color}`, display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:20, fontWeight:900, color:sel.color, fontFamily:M,
                  boxShadow:`0 0 30px ${sel.color}60,inset 0 0 20px ${sel.color}20` }}>{sel.avatar}</div>
                <div style={{ fontSize:17, fontWeight:900, color:"#fff", letterSpacing:2, marginBottom:6 }}>{sel.name}</div>
                <RankBadge rank={sel.rank} />
                <div style={{ marginTop:8, display:"flex", gap:6, justifyContent:"center" }}>
                  <span style={{ fontSize:9, background:"#1a1a3a", color:"#888", padding:"3px 8px", borderRadius:3, letterSpacing:1 }}>{sel.role.toUpperCase()}</span>
                  <span style={{ fontSize:9, background:sel.color+"22", color:sel.color, padding:"3px 8px", borderRadius:3, border:`1px solid ${sel.color}44`, letterSpacing:1 }}>{sel.game.toUpperCase()}</span>
                </div>
              </div>
              <div style={{ borderTop:`1px solid ${sel.color}22`, paddingTop:14, marginBottom:14 }}>
                <div style={{ fontSize:9, color:"#555", letterSpacing:2, marginBottom:10 }}>// PERFORMANCE</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                  {[["K/D", sel.kd.toFixed(1)], ["WINS", sel.wins]].map(([l,v]) => (
                    <div key={l} style={{ background:"#0d0d22", border:"1px solid #1a1a3a", borderRadius:6, padding:"10px 12px", textAlign:"center" }}>
                      <div style={{ fontSize:18, fontWeight:900, color:sel.color, fontFamily:M }}>{v}</div>
                      <div style={{ fontSize:8, color:"#555", letterSpacing:1 }}>{l}</div>
                    </div>
                  ))}
                </div>
                <StatBar label="Total Kills" value={sel.kills} max={maxK} color={sel.color} />
                <StatBar label="Wins"        value={sel.wins}  max={maxW} color={sel.color} />
              </div>
              <div style={{ borderTop:`1px solid ${sel.color}22`, paddingTop:12, marginBottom:14 }}>
                <div style={{ fontSize:9, color:"#555", letterSpacing:2, marginBottom:8 }}>// STATUS</div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%",
                    background: STATUS[sel.status].color,
                    boxShadow: STATUS[sel.status].pulse ? `0 0 12px ${STATUS[sel.status].color}` : "none",
                    animation: STATUS[sel.status].pulse ? "blink 1.5s infinite" : "none" }} />
                  <span style={{ fontSize:11, color:STATUS[sel.status].color, letterSpacing:2, fontWeight:700 }}>
                    {STATUS[sel.status].label}
                  </span>
                </div>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <button onClick={() => setModal(sel)}
                  onMouseEnter={e => { e.currentTarget.style.background="#a259ff"; e.currentTarget.style.color="#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="#a259ff15"; e.currentTarget.style.color="#a259ff"; }}
                  style={{ flex:1, background:"#a259ff15", border:"1px solid #a259ff55", color:"#a259ff",
                    borderRadius:4, padding:"8px", cursor:"pointer", fontSize:9, letterSpacing:2, fontFamily:M, transition:"all 0.2s" }}>
                  ✎ EDIT
                </button>
                <button onClick={() => setDelTgt(sel)}
                  onMouseEnter={e => { e.currentTarget.style.background="#ff2d78"; e.currentTarget.style.color="#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="#ff2d7815"; e.currentTarget.style.color="#ff2d78"; }}
                  style={{ flex:1, background:"#ff2d7815", border:"1px solid #ff2d7855", color:"#ff2d78",
                    borderRadius:4, padding:"8px", cursor:"pointer", fontSize:9, letterSpacing:2, fontFamily:M, transition:"all 0.2s" }}>
                  ✕ REMOVE
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop:20, display:"flex", justifyContent:"space-between" }}>
          <div style={{ fontSize:9, color:"#2a2a4a", letterSpacing:2 }}>PHANTOM.PROTOCOL // ENCRYPTED</div>
          <div style={{ fontSize:9, color:"#2a2a4a", letterSpacing:2 }}>SYS_TICK: {String(tick).padStart(6,"0")}</div>
        </div>
      </div>

      {modal === "add"                     && <MemberModal              onSave={handleSave} onClose={() => setModal(null)} />}
      {modal && modal !== "add"            && <MemberModal member={modal} onSave={handleSave} onClose={() => setModal(null)} />}
      {delTgt                              && <DeleteConfirm member={delTgt} onConfirm={handleDelete} onClose={() => setDelTgt(null)} />}
      {toast                               && <Toast key={toast.key} msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}

/* ── LEADERBOARD ROW ── */
const MEDAL  = ["🥇","🥈","🥉"];
const TROPHY = ["#ffd700","#c0c0c0","#cd7f32"];

function LbRow({ member: m, rank, metric, maxVal, animate }) {
  const [hov, setHov] = useState(false);
  const val  = metric === "kd" ? m.kd : metric === "kills" ? m.kills : m.wins;
  const pct  = (val / maxVal) * 100;
  const [bw, setBw] = useState(0);
  useEffect(() => {
    if (animate) { const t = setTimeout(() => setBw(pct), 80 + rank * 60); return () => clearTimeout(t); }
    else setBw(0);
  }, [animate, pct, rank]);

  const isTop = rank < 3;
  const rc    = isTop ? TROPHY[rank] : m.color;

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 16px",
        background: hov ? `${rc}12` : "#080818",
        border: `1px solid ${(hov || isTop) ? rc+"55" : "#1a1a3a"}`,
        borderRadius:8, transition:"all 0.2s",
        boxShadow: isTop ? `0 0 20px ${rc}20` : hov ? `0 0 10px ${rc}20` : "none",
        animation: `slideIn 0.4s ease ${rank*0.07}s both`,
        position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:`${bw}%`,
        background:`linear-gradient(90deg,${rc}08,transparent)`,
        transition:"width 0.9s cubic-bezier(0.4,0,0.2,1)", pointerEvents:"none" }} />
      <div style={{ width:36, textAlign:"center", flexShrink:0 }}>
        {rank < 3
          ? <span style={{ fontSize:22 }}>{MEDAL[rank]}</span>
          : <span style={{ fontSize:14, fontWeight:900, color:"#555", fontFamily:M }}>#{rank+1}</span>}
      </div>
      <div style={{ width:40, height:40, borderRadius:"50%", flexShrink:0,
        background:`linear-gradient(135deg,${m.color}44,${m.color}11)`,
        border:`2px solid ${isTop ? rc : m.color+"88"}`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:12, fontWeight:800, color:m.color, fontFamily:M,
        boxShadow: isTop ? `0 0 16px ${rc}80` : "none" }}>{m.avatar}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontWeight:700, fontSize:14, color:isTop ? rc : "#e8e8ff", fontFamily:M, letterSpacing:1 }}>{m.name}</div>
        <div style={{ display:"flex", gap:6, marginTop:3, alignItems:"center" }}>
          <RankBadge rank={m.rank} />
          <span style={{ fontSize:9, color:"#555", fontFamily:M }}>{m.game}</span>
        </div>
      </div>
      <div style={{ flex:1, maxWidth:200 }}>
        <div style={{ height:4, background:"#1a1a3a", borderRadius:2, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${bw}%`,
            background:`linear-gradient(90deg,${rc}66,${rc})`,
            borderRadius:2, transition:"width 0.9s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: isTop ? `0 0 8px ${rc}` : "none" }} />
        </div>
      </div>
      <div style={{ textAlign:"right", flexShrink:0, minWidth:70 }}>
        <div style={{ fontSize:18, fontWeight:900, color:rc, fontFamily:M }}>
          {metric === "kd" ? val.toFixed(1) : val.toLocaleString()}
        </div>
        <div style={{ fontSize:9, color:"#555", letterSpacing:1 }}>
          {metric === "kd" ? "K/D" : metric === "kills" ? "KILLS" : "WINS"}
        </div>
      </div>
    </div>
  );
}

/* ── LEADERBOARD PAGE ── */
function LeaderboardPage({ members, setPage, onBack }) {
  const [metric,  setMetric]  = useState("kd");
  const [animate, setAnimate] = useState(false);

  const sorted = [...members].sort((a, b) =>
    metric === "kd" ? b.kd - a.kd : metric === "kills" ? b.kills - a.kills : b.wins - a.wins);
  const maxVal = metric === "kd"
    ? Math.max(...members.map(m => m.kd))
    : metric === "kills"
    ? Math.max(...members.map(m => m.kills))
    : Math.max(...members.map(m => m.wins));

  const champ = sorted[0];

  useEffect(() => {
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(t);
  }, [metric]);

  const tabStyle = (v) => ({
    background: metric===v ? "#ffd70018" : "transparent",
    border: `1px solid ${metric===v ? "#ffd700" : "#1a1a3a"}`,
    color: metric===v ? "#ffd700" : "#555",
    borderRadius:4, padding:"7px 14px", cursor:"pointer", fontSize:9,
    letterSpacing:1, fontFamily:M, transition:"all 0.2s",
  });

  return (
    <div style={{ minHeight:"100vh", background:"#05050f", fontFamily:M, color:"#e8e8ff",
      padding:"24px 20px", animation:"fadeUp 0.5s ease" }}>
      <GridBg />
      <div style={{ position:"relative", zIndex:2, maxWidth:860, margin:"0 auto" }}>
        <NavBar page="leaderboard" setPage={setPage} onBack={onBack} />

        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:2 }}>
              <div style={{ width:3, height:28, background:"#ffd700", boxShadow:"0 0 12px #ffd700", borderRadius:2 }} />
              <h1 style={{ margin:0, fontSize:22, fontWeight:900, letterSpacing:3, color:"#fff", textShadow:"0 0 30px #ffd70060" }}>HALL OF FAME</h1>
            </div>
            <div style={{ fontSize:9, color:"#ffd70055", letterSpacing:2, paddingLeft:13 }}>// TOP OPERATIVE RANKINGS</div>
          </div>
          <div style={{ display:"flex", gap:4 }}>
            <button onClick={() => setMetric("kd")}    style={tabStyle("kd")}>BOTTLE</button>
            <button onClick={() => setMetric("kills")} style={tabStyle("kills")}>POOL</button>
            <button onClick={() => setMetric("wins")}  style={tabStyle("wins")}>PUNCH</button>
          </div>
        </div>

        {/* Champion spotlight */}
        {champ && (
          <div style={{ background:"linear-gradient(135deg,#ffd70015 0%,#0a0a1a 100%)",
            border:"1px solid #ffd70044", borderRadius:10, padding:"20px 24px", marginBottom:20,
            boxShadow:"0 0 40px #ffd70018", position:"relative", overflow:"hidden", animation:"fadeUp 0.5s ease" }}>
            <div style={{ position:"absolute", left:0, right:0, height:2, pointerEvents:"none",
              background:"linear-gradient(90deg,transparent,#ffd70060,transparent)", animation:"scan 4s linear infinite" }} />
            <div style={{ fontSize:9, color:"#ffd70088", letterSpacing:3, marginBottom:12 }}>⚡ CURRENT CHAMPION</div>
            <div style={{ display:"flex", alignItems:"center", gap:20 }}>
              <div style={{ position:"relative" }}>
                <div style={{ width:80, height:80, borderRadius:"50%",
                  background:`linear-gradient(135deg,${champ.color}44,${champ.color}11)`,
                  border:"3px solid #ffd700", display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:24, fontWeight:900, color:"#ffd700", fontFamily:M,
                  boxShadow:"0 0 40px #ffd70060,inset 0 0 20px #ffd70020" }}>{champ.avatar}</div>
                <div style={{ position:"absolute", top:-4, right:-4, fontSize:18 }}>👑</div>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:24, fontWeight:900, color:"#fff", letterSpacing:3, fontFamily:M, textShadow:"0 0 20px #ffd70060" }}>{champ.name}</div>
                <div style={{ display:"flex", gap:8, marginTop:6, alignItems:"center" }}>
                  <RankBadge rank={champ.rank} />
                  <span style={{ fontSize:9, color:"#888", letterSpacing:1 }}>{champ.game} // {champ.role}</span>
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:40, fontWeight:900, color:"#ffd700", fontFamily:M, textShadow:"0 0 30px #ffd70080", lineHeight:1 }}>
                  {metric === "kd" ? champ.kd.toFixed(1) : metric === "kills" ? champ.kills.toLocaleString() : champ.wins.toLocaleString()}
                </div>
                <div style={{ fontSize:10, color:"#ffd70088", letterSpacing:2 }}>
                  {metric === "kd" ? "K/D RATIO" : metric === "kills" ? "TOTAL KILLS" : "TOTAL WINS"}
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {sorted.map((m, i) => (
            <LbRow key={m.id} member={m} rank={i} metric={metric} maxVal={maxVal} animate={animate} />
          ))}
        </div>

        <div style={{ marginTop:20, display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
          {[
            ["SQUAD SIZE",  members.length,                                     "OPERATIVES"],
            ["TOTAL KILLS", members.reduce((a,m)=>a+m.kills,0).toLocaleString(),"COMBINED"  ],
            ["TOP K/D",     Math.max(...members.map(m=>m.kd)).toFixed(1),        "RATIO"     ],
          ].map(([label, val, sub]) => (
            <div key={label} style={{ background:"#080818", border:"1px solid #1a1a3a", borderRadius:6, padding:"12px", textAlign:"center" }}>
              <div style={{ fontSize:9, color:"#555", letterSpacing:2, marginBottom:4 }}>{label}</div>
              <div style={{ fontSize:20, fontWeight:900, color:"#ffd700", fontFamily:M }}>{val}</div>
              <div style={{ fontSize:8, color:"#333", letterSpacing:2 }}>{sub}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop:16, display:"flex", justifyContent:"space-between" }}>
          <div style={{ fontSize:9, color:"#2a2a4a", letterSpacing:2 }}>PHANTOM.PROTOCOL // HALL OF FAME</div>
          <div style={{ fontSize:9, color:"#2a2a4a", letterSpacing:2 }}>SEASON 04 // ACTIVE</div>
        </div>
      </div>
    </div>
  );
}

/* ── ROOT ── */
export default function App() {
  const [screen,  setScreen]  = useState("landing");
  const [page,    setPage]    = useState("roster");
  const [members, setMembers] = useState(INIT);

  return (
    <div style={{ minHeight:"100vh", background:"#05050f", overflow:"hidden" }}>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:none} }
        @keyframes blink   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.5)} }
        @keyframes glow    { 0%,100%{opacity:0.7} 50%{opacity:1} }
        @keyframes scan    { 0%{top:-2px} 100%{top:100%} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:none} }
        * { box-sizing:border-box }
        ::-webkit-scrollbar { width:4px }
        ::-webkit-scrollbar-track { background:#0a0a1a }
        ::-webkit-scrollbar-thumb { background:#1a1a4a; border-radius:2px }
        input::placeholder { color:#333 }
        select option { background:#0d0d22 }
      `}</style>
      <BgCanvas />
      {screen === "landing" && (
        <LandingPage onEnter={() => { setScreen("app"); setPage("roster"); }} />
      )}
      {screen === "app" && page === "roster" && (
        <RosterPage members={members} setMembers={setMembers} setPage={setPage} onBack={() => setScreen("landing")} />
      )}
      {screen === "app" && page === "leaderboard" && (
        <LeaderboardPage members={members} setPage={setPage} onBack={() => setScreen("landing")} />
      )}
    </div>
  );
}
