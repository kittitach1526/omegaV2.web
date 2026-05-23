// ─────────────────────────────────────────────
//  pages/LeaderboardPage.jsx
//  หน้า Hall of Fame / Leaderboard
//  แก้ตัวชี้วัด (metric), สีเหรียญ ได้ที่นี่
// ─────────────────────────────────────────────

import { useState, useEffect } from "react";
import { MONO, TROPHY_COLOR, MEDAL } from "../constants.js";
import { GridBg, NavBar, RankBadge } from "../components/index.jsx";

// ─── Leaderboard Row ──────────────────────────
function LbRow({ member: m, rank, metric, maxVal, animate }) {
  const [hov, setHov] = useState(false);
  const [bw,  setBw]  = useState(0);

  const val = metric === "kd" ? m.kd : metric === "kills" ? m.kills : m.wins;
  const pct = (val / maxVal) * 100;
  const isTop = rank < 3;
  const rc    = isTop ? TROPHY_COLOR[rank] : m.color;

  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setBw(pct), 80 + rank * 60);
      return () => clearTimeout(t);
    } else {
      setBw(0);
    }
  }, [animate, pct, rank]);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "12px 16px",
        background: hov ? `${rc}12` : "#080818",
        border: `1px solid ${(hov || isTop) ? rc + "55" : "#1a1a3a"}`,
        borderRadius: 8, transition: "all 0.2s",
        boxShadow: isTop ? `0 0 20px ${rc}20` : hov ? `0 0 10px ${rc}20` : "none",
        animation: `slideIn 0.4s ease ${rank * 0.07}s both`,
        position: "relative", overflow: "hidden",
      }}>

      {/* Animated bar background */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: `${bw}%`,
        background: `linear-gradient(90deg,${rc}08,transparent)`,
        transition: "width 0.9s cubic-bezier(0.4,0,0.2,1)", pointerEvents: "none",
      }} />

      {/* Rank / Medal */}
      <div style={{ width: 36, textAlign: "center", flexShrink: 0 }}>
        {rank < 3
          ? <span style={{ fontSize: 22 }}>{MEDAL[rank]}</span>
          : <span style={{ fontSize: 14, fontWeight: 900, color: "#555", fontFamily: MONO }}>#{rank + 1}</span>}
      </div>

      {/* Avatar */}
      <div style={{
        width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
        background: `linear-gradient(135deg,${m.color}44,${m.color}11)`,
        border: `2px solid ${isTop ? rc : m.color + "88"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 800, color: m.color, fontFamily: MONO,
        boxShadow: isTop ? `0 0 16px ${rc}80` : "none",
      }}>{m.avatar}</div>

      {/* Name + info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: isTop ? rc : "#e8e8ff", fontFamily: MONO, letterSpacing: 1 }}>{m.name}</div>
        <div style={{ display: "flex", gap: 6, marginTop: 3, alignItems: "center" }}>
          <RankBadge rank={m.rank} />
          <span style={{ fontSize: 9, color: "#555", fontFamily: MONO }}>{m.game}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ flex: 1, maxWidth: 200 }}>
        <div style={{ height: 4, background: "#1a1a3a", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${bw}%`,
            background: `linear-gradient(90deg,${rc}66,${rc})`,
            borderRadius: 2, transition: "width 0.9s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: isTop ? `0 0 8px ${rc}` : "none",
          }} />
        </div>
      </div>

      {/* Value */}
      <div style={{ textAlign: "right", flexShrink: 0, minWidth: 70 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: rc, fontFamily: MONO }}>
          {metric === "kd" ? val.toFixed(1) : val.toLocaleString()}
        </div>
        <div style={{ fontSize: 9, color: "#555", letterSpacing: 1 }}>
          {metric === "kd" ? "K/D" : metric === "kills" ? "KILLS" : "WINS"}
        </div>
      </div>
    </div>
  );
}

// ─── Champion Spotlight ───────────────────────
function ChampionCard({ champ, metric }) {
  return (
    <div style={{
      background: "linear-gradient(135deg,#ffd70015 0%,#0a0a1a 100%)",
      border: "1px solid #ffd70044", borderRadius: 10,
      padding: "20px 24px", marginBottom: 20,
      boxShadow: "0 0 40px #ffd70018", position: "relative",
      overflow: "hidden", animation: "fadeUp 0.5s ease",
    }}>
      <div style={{
        position: "absolute", left: 0, right: 0, height: 2, pointerEvents: "none",
        background: "linear-gradient(90deg,transparent,#ffd70060,transparent)",
        animation: "scan 4s linear infinite",
      }} />

      <div style={{ fontSize: 9, color: "#ffd70088", letterSpacing: 3, marginBottom: 12 }}>⚡ CURRENT CHAMPION</div>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ position: "relative" }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: `linear-gradient(135deg,${champ.color}44,${champ.color}11)`,
            border: "3px solid #ffd700",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, fontWeight: 900, color: "#ffd700", fontFamily: MONO,
            boxShadow: "0 0 40px #ffd70060,inset 0 0 20px #ffd70020",
          }}>{champ.avatar}</div>
          <div style={{ position: "absolute", top: -4, right: -4, fontSize: 18 }}>👑</div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: 3, fontFamily: MONO, textShadow: "0 0 20px #ffd70060" }}>
            {champ.name}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center" }}>
            <RankBadge rank={champ.rank} />
            <span style={{ fontSize: 9, color: "#888", letterSpacing: 1 }}>{champ.game} // {champ.role}</span>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 40, fontWeight: 900, color: "#ffd700", fontFamily: MONO, textShadow: "0 0 30px #ffd70080", lineHeight: 1 }}>
            {metric === "kd"
              ? champ.kd.toFixed(1)
              : metric === "kills"
              ? champ.kills.toLocaleString()
              : champ.wins.toLocaleString()}
          </div>
          <div style={{ fontSize: 10, color: "#ffd70088", letterSpacing: 2 }}>
            {metric === "kd" ? "K/D RATIO" : metric === "kills" ? "TOTAL KILLS" : "TOTAL WINS"}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Leaderboard Page ────────────────────
export default function LeaderboardPage({ members, setPage, onBack }) {
  const [metric,  setMetric]  = useState("kd");
  const [animate, setAnimate] = useState(false);

  const sorted = [...members].sort((a, b) =>
    metric === "kd"    ? b.kd - a.kd :
    metric === "kills" ? b.kills - a.kills :
                         b.wins - a.wins);

  const maxVal = metric === "kd"
    ? Math.max(...members.map(m => m.kd))
    : metric === "kills"
    ? Math.max(...members.map(m => m.kills))
    : Math.max(...members.map(m => m.wins));

  const champ = sorted[0];

  // Re-trigger bar animations when metric changes
  useEffect(() => {
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(t);
  }, [metric]);

  const tabStyle = v => ({
    background: metric === v ? "#ffd70018" : "transparent",
    border: `1px solid ${metric === v ? "#ffd700" : "#1a1a3a"}`,
    color:  metric === v ? "#ffd700" : "#555",
    borderRadius: 4, padding: "7px 14px", cursor: "pointer",
    fontSize: 9, letterSpacing: 1, fontFamily: MONO, transition: "all 0.2s",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#05050f", fontFamily: MONO, color: "#e8e8ff",
      padding: "24px 20px", animation: "fadeUp 0.5s ease" }}>
      <GridBg />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 860, margin: "0 auto" }}>

        <NavBar page="leaderboard" setPage={setPage} onBack={onBack} />

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
              <div style={{ width: 3, height: 28, background: "#ffd700", boxShadow: "0 0 12px #ffd700", borderRadius: 2 }} />
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, letterSpacing: 3, color: "#fff", textShadow: "0 0 30px #ffd70060" }}>
                HALL OF FAME
              </h1>
            </div>
            <div style={{ fontSize: 9, color: "#ffd70055", letterSpacing: 2, paddingLeft: 13 }}>
              // TOP OPERATIVE RANKINGS
            </div>
          </div>

          {/* Metric tabs */}
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={() => setMetric("kd")}    style={tabStyle("kd")}>K/D RATIO</button>
            <button onClick={() => setMetric("kills")} style={tabStyle("kills")}>KILLS</button>
            <button onClick={() => setMetric("wins")}  style={tabStyle("wins")}>WINS</button>
          </div>
        </div>

        {/* Champion */}
        {champ && <ChampionCard champ={champ} metric={metric} />}

        {/* Rankings */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {sorted.map((m, i) => (
            <LbRow key={m.id} member={m} rank={i} metric={metric} maxVal={maxVal} animate={animate} />
          ))}
        </div>

        {/* Summary footer cards */}
        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
          {[
            ["SQUAD SIZE",  members.length,                                      "OPERATIVES"],
            ["TOTAL KILLS", members.reduce((a,m)=>a+m.kills,0).toLocaleString(), "COMBINED"  ],
            ["TOP K/D",     Math.max(...members.map(m=>m.kd)).toFixed(1),         "RATIO"     ],
          ].map(([label, val, sub]) => (
            <div key={label} style={{ background: "#080818", border: "1px solid #1a1a3a", borderRadius: 6, padding: "12px", textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "#555", letterSpacing: 2, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#ffd700", fontFamily: MONO }}>{val}</div>
              <div style={{ fontSize: 8, color: "#333", letterSpacing: 2 }}>{sub}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 9, color: "#2a2a4a", letterSpacing: 2 }}>PHANTOM.PROTOCOL // HALL OF FAME</div>
          <div style={{ fontSize: 9, color: "#2a2a4a", letterSpacing: 2 }}>SEASON 04 // ACTIVE</div>
        </div>
      </div>
    </div>
  );
}
