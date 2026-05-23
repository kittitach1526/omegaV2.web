// ─────────────────────────────────────────────
//  pages/RosterPage.jsx
//  หน้ารายชื่อสมาชิก + modal เพิ่ม/แก้/ลบ
// ─────────────────────────────────────────────

import { useState, useEffect } from "react";
import {
  RANKS, ROLES, GAMES, PALETTE, STATUSES, RANK_WEIGHT, STATUS_CFG, MONO,
} from "../constants.js";
import { makeAvatar } from "../utils.js";
import {
  GridBg, NavBar, RankBadge, StatBar, MemberCard, Toast,
} from "../components/index.jsx";

// ─── Field Label helper ───────────────────────
const FL = ({ children }) => (
  <div style={{ fontSize: 9, color: "#555", letterSpacing: 2, marginBottom: 5 }}>{children}</div>
);

// ─── Add / Edit Modal ─────────────────────────
function MemberModal({ member, onSave, onClose }) {
  const isEdit = !!(member && member.id);
  const blank  = { name: "", rank: "Diamond", role: "Entry", kills: 0, kd: 1.0, status: "online", color: "#00f5ff", game: "Valorant", wins: 0 };
  const [form, setForm] = useState(isEdit ? member : blank);
  const [err,  setErr]  = useState("");

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    const name = (form.name || "").trim();
    if (!name)          { setErr("NAME IS REQUIRED"); return; }
    if (name.length < 3){ setErr("NAME TOO SHORT (MIN 3)"); return; }
    onSave({
      ...form, name,
      avatar: makeAvatar(name),
      kills:  Number(form.kills)    || 0,
      kd:     parseFloat(form.kd)   || 1.0,
      wins:   Number(form.wins)     || 0,
      id:     isEdit ? member.id : Date.now(),
    });
  };

  const inputStyle = (highlight) => ({
    width: "100%", background: "#0a0a1a",
    border: `1px solid ${highlight ? "#ff2d78" : "#1a1a3a"}`,
    borderRadius: 4, padding: "8px 10px", color: "#e8e8ff",
    fontSize: 11, letterSpacing: 1, outline: "none", fontFamily: MONO,
  });
  const selStyle = {
    width: "100%", background: "#0a0a1a", border: "1px solid #1a1a3a",
    borderRadius: 4, padding: "8px 10px", color: "#e8e8ff",
    fontSize: 11, fontFamily: MONO, cursor: "pointer",
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 200, background: "#000000cc",
        display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeUp 0.2s ease" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "#080818", border: "1px solid #00f5ff44", borderRadius: 10,
        padding: 28, width: "min(500px,95vw)", position: "relative",
        boxShadow: "0 0 60px #00f5ff20", animation: "modalIn 0.3s cubic-bezier(0.2,0,0,1)", overflow: "hidden",
      }}>
        {/* Scanline */}
        <div style={{
          position: "absolute", left: 0, right: 0, height: 2, pointerEvents: "none",
          background: "linear-gradient(90deg,transparent,#00f5ff50,transparent)",
          animation: "scan 3s linear infinite",
        }} />

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#fff", letterSpacing: 3, fontFamily: MONO }}>
              {isEdit ? "EDIT OPERATIVE" : "ADD OPERATIVE"}
            </div>
            <div style={{ fontSize: 9, color: "#00f5ff55", letterSpacing: 2, marginTop: 2 }}>// SQUAD MANAGEMENT CONSOLE</div>
          </div>
          <button onClick={onClose}
            onMouseEnter={e => { e.currentTarget.style.color="#ff2d78"; e.currentTarget.style.borderColor="#ff2d78"; }}
            onMouseLeave={e => { e.currentTarget.style.color="#555";    e.currentTarget.style.borderColor="#1a1a3a"; }}
            style={{ background: "transparent", border: "1px solid #1a1a3a", color: "#555",
              borderRadius: 4, width: 28, height: 28, cursor: "pointer", fontSize: 14, fontFamily: MONO,
              display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>✕</button>
        </div>

        {/* Avatar preview */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", margin: "0 auto",
            background: `linear-gradient(135deg,${form.color}44,${form.color}11)`,
            border: `2px solid ${form.color}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 900, color: form.color, fontFamily: MONO,
            boxShadow: `0 0 20px ${form.color}60`, transition: "all 0.3s",
          }}>
            {makeAvatar(form.name || "??")}
          </div>
        </div>

        {/* Form */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div style={{ gridColumn: "1/-1" }}>
            <FL>OPERATIVE NAME *</FL>
            <input value={form.name} onChange={e => upd("name", e.target.value)}
              placeholder="e.g. ShadowByte" style={inputStyle(err && !form.name.trim())} />
            {err && <div style={{ fontSize: 9, color: "#ff2d78", marginTop: 4, letterSpacing: 1 }}>{err}</div>}
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
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", paddingTop: 4 }}>
              {PALETTE.map(c => (
                <div key={c} onClick={() => upd("color", c)} style={{
                  width: 22, height: 22, borderRadius: "50%", background: c, cursor: "pointer",
                  border: `2px solid ${form.color === c ? "#fff" : "transparent"}`,
                  boxShadow: form.color === c ? `0 0 10px ${c}` : "none",
                  transition: "all 0.15s",
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onClose}
            onMouseEnter={e => { e.currentTarget.style.borderColor="#555"; e.currentTarget.style.color="#888"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="#1a1a3a"; e.currentTarget.style.color="#555"; }}
            style={{ flex: 1, background: "transparent", border: "1px solid #1a1a3a", color: "#555",
              borderRadius: 4, padding: "10px", cursor: "pointer", fontSize: 10,
              letterSpacing: 2, fontFamily: MONO, transition: "all 0.2s" }}>CANCEL</button>
          <button onClick={handleSave}
            onMouseEnter={e => { e.currentTarget.style.background="#00f5ff"; e.currentTarget.style.color="#05050f"; }}
            onMouseLeave={e => { e.currentTarget.style.background="#00f5ff15"; e.currentTarget.style.color="#00f5ff"; }}
            style={{ flex: 2, background: "#00f5ff15", border: "1px solid #00f5ff", color: "#00f5ff",
              borderRadius: 4, padding: "10px", cursor: "pointer", fontSize: 10,
              letterSpacing: 2, fontFamily: MONO, boxShadow: "0 0 16px #00f5ff30", transition: "all 0.2s" }}>
            {isEdit ? "▶ UPDATE OPERATIVE" : "▶ ENLIST OPERATIVE"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirmation Modal ────────────────
function DeleteConfirm({ member: m, onConfirm, onClose }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 200, background: "#000000cc",
        display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "#080818", border: "1px solid #ff2d7866", borderRadius: 10,
        padding: 28, width: "min(360px,90vw)", textAlign: "center",
        boxShadow: "0 0 60px #ff2d7820", animation: "modalIn 0.25s ease",
      }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⚠</div>
        <div style={{ fontSize: 13, fontWeight: 900, color: "#ff2d78", letterSpacing: 3, fontFamily: MONO, marginBottom: 8 }}>
          TERMINATE OPERATIVE
        </div>
        <div style={{ fontSize: 11, color: "#888", fontFamily: MONO, marginBottom: 20, letterSpacing: 1 }}>
          Remove <span style={{ color: "#fff" }}>{m.name}</span> from the roster?<br />This action cannot be undone.
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onClose} style={{
            flex: 1, background: "transparent", border: "1px solid #1a1a3a", color: "#555",
            borderRadius: 4, padding: "10px", cursor: "pointer", fontSize: 10,
            letterSpacing: 2, fontFamily: MONO,
          }}>ABORT</button>
          <button onClick={onConfirm}
            onMouseEnter={e => { e.currentTarget.style.background="#ff2d78"; e.currentTarget.style.color="#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background="#ff2d7815"; e.currentTarget.style.color="#ff2d78"; }}
            style={{ flex: 1, background: "#ff2d7815", border: "1px solid #ff2d78", color: "#ff2d78",
              borderRadius: 4, padding: "10px", cursor: "pointer", fontSize: 10,
              letterSpacing: 2, fontFamily: MONO, boxShadow: "0 0 16px #ff2d7830", transition: "all 0.2s" }}>
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Member Detail Panel ──────────────────────
function DetailPanel({ member: sel, members, onEdit, onDelete }) {
  const st   = STATUS_CFG[sel.status];
  const maxK = Math.max(...members.map(m => m.kills), 1);
  const maxW = Math.max(...members.map(m => m.wins), 1);

  return (
    <div key={sel.id} style={{
      background: "#080818", border: `1px solid ${sel.color}66`,
      borderRadius: 8, padding: 20,
      position: "sticky", top: 0, alignSelf: "start",
      animation: "fadeUp 0.3s ease", boxShadow: `0 0 40px ${sel.color}20`,
      overflow: "hidden",
    }}>
      {/* Scanline */}
      <div style={{
        position: "absolute", left: 0, right: 0, height: 2, pointerEvents: "none",
        background: `linear-gradient(90deg,transparent,${sel.color}60,transparent)`,
        animation: "scan 3s linear infinite",
      }} />

      {/* Avatar + name */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%", margin: "0 auto 12px",
          background: `linear-gradient(135deg,${sel.color}44,${sel.color}11)`,
          border: `3px solid ${sel.color}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, fontWeight: 900, color: sel.color, fontFamily: MONO,
          boxShadow: `0 0 30px ${sel.color}60,inset 0 0 20px ${sel.color}20`,
        }}>{sel.avatar}</div>
        <div style={{ fontSize: 17, fontWeight: 900, color: "#fff", letterSpacing: 2, marginBottom: 6 }}>{sel.name}</div>
        <RankBadge rank={sel.rank} />
        <div style={{ marginTop: 8, display: "flex", gap: 6, justifyContent: "center" }}>
          <span style={{ fontSize: 9, background: "#1a1a3a", color: "#888", padding: "3px 8px", borderRadius: 3, letterSpacing: 1 }}>
            {sel.role.toUpperCase()}
          </span>
          <span style={{ fontSize: 9, background: sel.color + "22", color: sel.color, padding: "3px 8px",
            borderRadius: 3, border: `1px solid ${sel.color}44`, letterSpacing: 1 }}>
            {sel.game.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ borderTop: `1px solid ${sel.color}22`, paddingTop: 14, marginBottom: 14 }}>
        <div style={{ fontSize: 9, color: "#555", letterSpacing: 2, marginBottom: 10 }}>// PERFORMANCE</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          {[["K/D", sel.kd.toFixed(1)], ["WINS", sel.wins]].map(([l, v]) => (
            <div key={l} style={{ background: "#0d0d22", border: "1px solid #1a1a3a", borderRadius: 6, padding: "10px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: sel.color, fontFamily: MONO }}>{v}</div>
              <div style={{ fontSize: 8, color: "#555", letterSpacing: 1 }}>{l}</div>
            </div>
          ))}
        </div>
        <StatBar label="Total Kills" value={sel.kills} max={maxK} color={sel.color} />
        <StatBar label="Wins"        value={sel.wins}  max={maxW} color={sel.color} />
      </div>

      {/* Status */}
      <div style={{ borderTop: `1px solid ${sel.color}22`, paddingTop: 12, marginBottom: 14 }}>
        <div style={{ fontSize: 9, color: "#555", letterSpacing: 2, marginBottom: 8 }}>// STATUS</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", background: st.color,
            boxShadow: st.pulse ? `0 0 12px ${st.color}` : "none",
            animation: st.pulse ? "blink 1.5s infinite" : "none",
          }} />
          <span style={{ fontSize: 11, color: st.color, letterSpacing: 2, fontWeight: 700 }}>{st.label}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={onEdit}
          onMouseEnter={e => { e.currentTarget.style.background="#a259ff"; e.currentTarget.style.color="#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background="#a259ff15"; e.currentTarget.style.color="#a259ff"; }}
          style={{ flex: 1, background: "#a259ff15", border: "1px solid #a259ff55", color: "#a259ff",
            borderRadius: 4, padding: "8px", cursor: "pointer", fontSize: 9,
            letterSpacing: 2, fontFamily: MONO, transition: "all 0.2s" }}>✎ EDIT</button>
        <button onClick={onDelete}
          onMouseEnter={e => { e.currentTarget.style.background="#ff2d78"; e.currentTarget.style.color="#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background="#ff2d7815"; e.currentTarget.style.color="#ff2d78"; }}
          style={{ flex: 1, background: "#ff2d7815", border: "1px solid #ff2d7855", color: "#ff2d78",
            borderRadius: 4, padding: "8px", cursor: "pointer", fontSize: 9,
            letterSpacing: 2, fontFamily: MONO, transition: "all 0.2s" }}>✕ REMOVE</button>
      </div>
    </div>
  );
}

// ─── Main Roster Page ─────────────────────────
export default function RosterPage({ members, setMembers, setPage, onBack }) {
  const [sel,    setSel]    = useState(members[0]);
  const [filter, setFilter] = useState("all");
  const [sort,   setSort]   = useState("kd");
  const [q,      setQ]      = useState("");
  const [tick,   setTick]   = useState(0);
  const [modal,  setModal]  = useState(null);   // null | "add" | memberObj
  const [delTgt, setDelTgt] = useState(null);
  const [toast,  setToast]  = useState(null);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (sel && !members.find(m => m.id === sel.id)) setSel(members[0]);
  }, [members]);

  const notify = (msg, type = "success") => setToast({ msg, type, key: Date.now() });

  const handleSave = data => {
    if (members.find(m => m.id === data.id)) {
      setMembers(ms => ms.map(m => m.id === data.id ? data : m));
      setSel(data);
      notify("OPERATIVE UPDATED");
    } else {
      setMembers(ms => [...ms, data]);
      setSel(data);
      notify("OPERATIVE ENLISTED");
    }
    setModal(null);
  };

  const handleDelete = () => {
    const next = members.find(m => m.id !== delTgt.id) || null;
    setMembers(ms => ms.filter(m => m.id !== delTgt.id));
    notify(`${delTgt.name} TERMINATED`, "error");
    setDelTgt(null);
    setSel(next);
  };

  const list = members
    .filter(m => filter === "all" || m.status === filter)
    .filter(m => m.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) =>
      sort === "kd"    ? b.kd - a.kd :
      sort === "kills" ? b.kills - a.kills :
      (RANK_WEIGHT[b.rank] || 0) - (RANK_WEIGHT[a.rank] || 0));

  const online = members.filter(m => m.status !== "offline").length;

  const filterBtn = (v, l) => (
    <button key={v} onClick={() => setFilter(v)} style={{
      background:    filter === v ? "#00f5ff15" : "transparent",
      border:  `1px solid ${filter === v ? "#00f5ff" : "#1a1a3a"}`,
      color:         filter === v ? "#00f5ff" : "#555",
      borderRadius: 4, padding: "8px 12px", fontSize: 10, cursor: "pointer",
      letterSpacing: 1, fontFamily: MONO, transition: "all 0.2s",
    }}>{l}</button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#05050f", fontFamily: MONO, color: "#e8e8ff",
      padding: "24px 20px", position: "relative", animation: "fadeUp 0.5s ease" }}>
      <GridBg />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 1060, margin: "0 auto" }}>

        <NavBar page="roster" setPage={setPage} onBack={onBack} />

        {/* Title row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
              <div style={{ width: 3, height: 28, background: "#00f5ff", boxShadow: "0 0 12px #00f5ff", borderRadius: 2 }} />
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, letterSpacing: 3, color: "#fff", textShadow: "0 0 30px #00f5ff60" }}>
                SQUAD ROSTER
              </h1>
            </div>
            <div style={{ fontSize: 9, color: "#00f5ff55", letterSpacing: 2, paddingLeft: 13 }}>
              // TACTICAL OPERATIVE DATABASE v2.4.1
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 9, color: "#555", letterSpacing: 2, marginBottom: 2 }}>ACTIVE</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#39ff14", fontFamily: MONO, animation: "glow 2s infinite" }}>
                {online}/{members.length}
              </div>
            </div>
            <button onClick={() => setModal("add")}
              onMouseEnter={e => { e.currentTarget.style.background="#00f5ff"; e.currentTarget.style.color="#05050f"; }}
              onMouseLeave={e => { e.currentTarget.style.background="#00f5ff15"; e.currentTarget.style.color="#00f5ff"; }}
              style={{ background: "#00f5ff15", border: "1px solid #00f5ff", color: "#00f5ff",
                borderRadius: 4, padding: "8px 16px", cursor: "pointer", fontSize: 10,
                letterSpacing: 2, fontFamily: MONO, boxShadow: "0 0 16px #00f5ff30", transition: "all 0.2s" }}>
              + ENLIST
            </button>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="SEARCH OPERATIVE..."
            style={{ flex: 1, minWidth: 160, background: "#0a0a1a", border: "1px solid #1a1a3a",
              borderRadius: 4, padding: "8px 12px", color: "#e8e8ff", fontSize: 11,
              letterSpacing: 1, outline: "none", fontFamily: MONO }} />
          {[["all","ALL"],["online","ONLINE"],["in-game","IN GAME"],["offline","OFFLINE"]].map(([v,l]) => filterBtn(v,l))}
          <select value={sort} onChange={e => setSort(e.target.value)} style={{
            background: "#0a0a1a", border: "1px solid #1a1a3a", borderRadius: 4,
            color: "#e8e8ff", padding: "8px 12px", fontSize: 10, letterSpacing: 1,
            fontFamily: MONO, cursor: "pointer",
          }}>
            <option value="kd">SORT: K/D</option>
            <option value="kills">SORT: KILLS</option>
            <option value="rank">SORT: RANK</option>
          </select>
        </div>

        {/* 2-col layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 12 }}>
          {/* Member list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {list.length === 0 && (
              <div style={{ textAlign: "center", color: "#333", padding: 40, fontSize: 11, letterSpacing: 2 }}>
                // NO OPERATIVES FOUND
              </div>
            )}
            {list.map((m, i) => (
              <MemberCard key={m.id} member={m} index={i} selected={sel?.id === m.id} onClick={() => setSel(m)} />
            ))}
          </div>

          {/* Detail panel */}
          {sel && (
            <DetailPanel
              member={sel}
              members={members}
              onEdit={()   => setModal(sel)}
              onDelete={()  => setDelTgt(sel)}
            />
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 9, color: "#2a2a4a", letterSpacing: 2 }}>PHANTOM.PROTOCOL // ENCRYPTED</div>
          <div style={{ fontSize: 9, color: "#2a2a4a", letterSpacing: 2 }}>SYS_TICK: {String(tick).padStart(6, "0")}</div>
        </div>
      </div>

      {modal === "add"          && <MemberModal              onSave={handleSave} onClose={() => setModal(null)} />}
      {modal && modal !== "add" && <MemberModal member={modal} onSave={handleSave} onClose={() => setModal(null)} />}
      {delTgt                   && <DeleteConfirm member={delTgt} onConfirm={handleDelete} onClose={() => setDelTgt(null)} />}
      {toast                    && <Toast key={toast.key} msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}
