// ─────────────────────────────────────────────
//  constants.js
//  แก้ข้อมูลสมาชิก, ตัวเลือก dropdown,
//  สีและ config ต่าง ๆ ได้ที่นี่
// ─────────────────────────────────────────────

/** รายชื่อสมาชิกเริ่มต้น — เพิ่ม/แก้/ลบได้เลย */
export const INIT_MEMBERS = [
  { id:1, name:"ShadowByte",   rank:"Grand Master", role:"Sniper",  kills:9842, kd:4.2, status:"online",  avatar:"SB", color:"#00f5ff", game:"Valorant",  wins:312 },
  { id:2, name:"NeonViper",    rank:"Challenger",   role:"Rusher",  kills:7631, kd:3.8, status:"in-game", avatar:"NV", color:"#ff2d78", game:"CS2",       wins:287 },
  { id:3, name:"VoidWalker",   rank:"Diamond",      role:"Support", kills:5204, kd:2.9, status:"online",  avatar:"VW", color:"#a259ff", game:"Apex",      wins:198 },
  { id:4, name:"GhostKing_X",  rank:"Platinum",     role:"Tank",    kills:4417, kd:2.4, status:"offline", avatar:"GK", color:"#39ff14", game:"Overwatch", wins:154 },
  { id:5, name:"CryptoAce",    rank:"Grand Master", role:"Flanker", kills:8103, kd:3.5, status:"in-game", avatar:"CA", color:"#ff6b35", game:"Valorant",  wins:276 },
  { id:6, name:"PixelReaper",  rank:"Master",       role:"IGL",     kills:6722, kd:3.1, status:"online",  avatar:"PR", color:"#00f5ff", game:"CS2",       wins:231 },
  { id:7, name:"StormBreaker", rank:"Diamond",      role:"Entry",   kills:5980, kd:2.7, status:"offline", avatar:"SB", color:"#ff2d78", game:"Apex",      wins:176 },
  { id:8, name:"IcePhantom",   rank:"Challenger",   role:"Lurker",  kills:7290, kd:4.0, status:"online",  avatar:"IP", color:"#a259ff", game:"Valorant",  wins:298 },
];

/** ตัวเลือก Rank (เรียงจากสูงสุด → ต่ำสุด) */
export const RANKS = ["Challenger", "Grand Master", "Master", "Diamond", "Platinum", "Gold"];

/** ตัวเลือก Role */
export const ROLES = ["Sniper", "Rusher", "Support", "Tank", "Flanker", "IGL", "Entry", "Lurker", "Scout"];

/** เกมที่รองรับ */
export const GAMES = ["Valorant", "CS2", "Apex", "Overwatch", "Fortnite", "PUBG"];

/** สีให้เลือกในฟอร์ม */
export const PALETTE = ["#00f5ff", "#ff2d78", "#a259ff", "#39ff14", "#ff6b35", "#ffd700", "#ff4444", "#00ff88"];

/** สถานะที่เลือกได้ */
export const STATUSES = ["online", "in-game", "offline"];

/** น้ำหนัก rank สำหรับเรียงลำดับ */
export const RANK_WEIGHT = {
  Challenger: 6,
  "Grand Master": 5,
  Master: 4,
  Diamond: 3,
  Platinum: 2,
  Gold: 1,
};

/** config แต่ละ status: label, สี, pulse */
export const STATUS_CFG = {
  online:    { label: "ONLINE",  color: "#39ff14", pulse: true  },
  "in-game": { label: "IN GAME", color: "#ff6b35", pulse: true  },
  offline:   { label: "OFFLINE", color: "#444",    pulse: false },
};

/** สีตาม rank */
export const RANK_COLOR = {
  Challenger:    "#00f5ff",
  "Grand Master":"#ff2d78",
  Master:        "#a259ff",
  Diamond:       "#39f4ff",
  Platinum:      "#b5d5ff",
  Gold:          "#ffd700",
};

/** สีเหรียญ Top 3 */
export const TROPHY_COLOR = ["#ffd700", "#c0c0c0", "#cd7f32"];

/** Emoji เหรียญ */
export const MEDAL = ["🥇", "🥈", "🥉"];

/** Font stack หลัก */
export const MONO = "'Courier New', monospace";
