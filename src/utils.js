// ─────────────────────────────────────────────
//  utils.js
//  helper functions ใช้ร่วมกันทั่วทั้งแอป
// ─────────────────────────────────────────────

/**
 * สร้าง avatar initials จากชื่อ
 * เช่น "ShadowByte" → "SB", "Ghost_King" → "GK"
 */
export function makeAvatar(name) {
  const parts = name.replace(/_/g, " ").split(" ");
  return (parts.length >= 2
    ? parts[0][0] + parts[1][0]
    : name.slice(0, 2)
  ).toUpperCase();
}
