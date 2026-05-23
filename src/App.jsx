// ─────────────────────────────────────────────
//  App.jsx  (Entry point)
//  จัดการ routing ระหว่าง landing / roster / leaderboard
//  และ global CSS keyframes
// ─────────────────────────────────────────────

import { useState } from "react";
import { INIT_MEMBERS } from "./constants.js";
import { BgCanvas } from "./components/index.jsx";
import LandingPage     from "./pages/LandingPage.jsx";
import RosterPage      from "./pages/RosterPage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";

// ─── Global CSS — แก้ animation / scrollbar ─
const GLOBAL_CSS = `
  @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
  @keyframes slideIn { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:none} }
  @keyframes blink   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.5)} }
  @keyframes glow    { 0%,100%{opacity:0.7} 50%{opacity:1} }
  @keyframes scan    { 0%{top:-2px} 100%{top:100%} }
  @keyframes modalIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:none} }
  * { box-sizing: border-box }
  ::-webkit-scrollbar { width: 4px }
  ::-webkit-scrollbar-track { background: #0a0a1a }
  ::-webkit-scrollbar-thumb { background: #1a1a4a; border-radius: 2px }
  input::placeholder { color: #333 }
  select option { background: #0d0d22 }
`;

// ─── Root App ─────────────────────────────────
export default function App() {
  const [screen,  setScreen]  = useState("landing");  // "landing" | "app"
  const [page,    setPage]    = useState("roster");    // "roster"  | "leaderboard"
  const [members, setMembers] = useState(INIT_MEMBERS);

  const goToApp  = () => { setScreen("app"); setPage("roster"); };
  const goHome   = () => setScreen("landing");

  return (
    <div style={{ minHeight: "100vh", background: "#05050f", overflow: "hidden" }}>
      <style>{GLOBAL_CSS}</style>
      <BgCanvas />

      {screen === "landing" && (
        <LandingPage onEnter={goToApp} />
      )}

      {screen === "app" && page === "roster" && (
        <RosterPage
          members={members}
          setMembers={setMembers}
          setPage={setPage}
          onBack={goHome}
        />
      )}

      {screen === "app" && page === "leaderboard" && (
        <LeaderboardPage
          members={members}
          setPage={setPage}
          onBack={goHome}
        />
      )}
    </div>
  );
}
