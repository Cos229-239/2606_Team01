// ============================================================
// CongruencePage.tsx
// ------------------------------------------------------------
// Shows the three mood state cards (Focused, Planning, Recharge).
// When the user clicks "Enter [State]", we:
//   1. Save the selected mood to localStorage under "active-mood"
//   2. Fire a "mood-change" CustomEvent so starfield.js picks
//      it up immediately and starts transitioning its colours.
//   3. Navigate to the relevant page via the Link component.
//
// The starfield transition is purely visual — no page reload
// needed. The mood persists across page navigation so the
// starfield stays in the selected mood colour scheme until
// the user picks a different one.
// ============================================================

import { useState } from "react";
import { Link } from "react-router-dom";
import { getTaskCountByMood, getTasksByMood, getUpcomingTaskTitle } from "../Data/taskStorage";

// ── Mood card definitions ────────────────────────────────────────────────
// Each entry maps to one of the MOOD_THEMES in starfield.js.
// "moodKey" must exactly match the key in MOOD_THEMES.
const stateCards = [
  {
    title:       "Focused",
    moodKey:     "Focused",       // matches MOOD_THEMES.Focused in starfield.js
    description: "Ready for deep work that moves the needle.",
    buttonText:  "Enter Focus",
    route:       "/focus",

    // Visual accent colour shown on the active card border
    accentColor: "rgba(100, 160, 255, 0.6)",
    accentGlow:  "rgba(80, 140, 255, 0.15)",
  },
  {
    title:       "Planning",
    moodKey:     "Planning",      // matches MOOD_THEMES.Planning in starfield.js
    description: "Organise ideas and prepare for execution.",
    buttonText:  "Start Planning",
    route:       "/planning",

    accentColor: "rgba(255, 180, 60, 0.6)",
    accentGlow:  "rgba(255, 160, 40, 0.15)",
  },
  {
    title:       "Recharge",
    moodKey:     "Recharge",      // matches MOOD_THEMES.Recharge in starfield.js
    description: "Recover energy through reflection, learning, or light creative work.",
    buttonText:  "Begin Recharge",
    route:       "/recharge",

    accentColor: "rgba(60, 220, 160, 0.6)",
    accentGlow:  "rgba(40, 200, 140, 0.15)",
  },
];

export default function CongruencePage() {

  // Track which mood card is currently selected (highlighted)
  // Initialise from localStorage so the selection persists on re-visit
  const [activeMood, setActiveMood] = useState<string>(
    () => localStorage.getItem("active-mood") || "Focused"
  );

  // ── handleMoodSelect ─────────────────────────────────────────────────
  // Called when the user clicks a mood card button.
  // Saves the mood and triggers the starfield theme transition.
  function handleMoodSelect(moodKey: string) {
    // Persist the selected mood so starfield.js can read it on any page
    localStorage.setItem("active-mood", moodKey);

    // Update local UI state to highlight the selected card
    setActiveMood(moodKey);

    // Notify starfield.js to start transitioning to the new colour theme.
    // starfield.js listens for this event via:
    //   window.addEventListener('mood-change', () => { ... })
    window.dispatchEvent(new CustomEvent("mood-change"));
  }

  return (
    <div>
      <h1>Congruence</h1>
      <hr />

      {/* Explanation of what congruence means in this app */}
      <p className="congruence-intro">
        Congruence is the alignment between who you actually are, who you want to be,
        and how you act every day. Within BetterEveryDay, Congruence dynamically matches
        the activities you choose to work on with your energy and focus levels.
      </p>

      {/* Step-by-step how it works */}
      <div className="how-it-works">
        <div className="section-heading">How it works</div>
        <ol>
          <li>Select how you're showing up today.</li>
          <li>BetterEveryDay recommends work that matches your mindset.</li>
          <li>Stay productive with activities designed for that state.</li>
        </ol>
      </div>

      {/* ── Mood state cards ──────────────────────────────────────────── */}
      <div className="state-selection">
        <div className="section-heading">How are you showing up today?</div>

        {/* Hint text to let users know clicking changes the background */}
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginBottom: "16px", marginTop: "-8px" }}>
          Selecting a mood changes the starfield theme
        </p>

        <div className="state-grid">
          {stateCards.map((state) => {

            // Is this card the currently selected mood?
            const isActive = activeMood === state.moodKey;

            return (
              <div
                key={state.title}
                className="glass-panel state-card"
                style={{
                  // Highlight the selected card with a coloured border + glow
                  borderColor:  isActive ? state.accentColor : undefined,
                  boxShadow:    isActive
                    ? `0 0 24px ${state.accentGlow}, 0 8px 32px rgba(0,0,0,0.35)`
                    : undefined,
                  transition: "border-color 0.4s, box-shadow 0.4s",
                }}
              >
                {/* Mood name + active indicator dot */}
                <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {state.title}
                  {/* Small dot shown next to the title when this mood is active */}
                  {isActive && (
                    <span style={{
                      display:      "inline-block",
                      width:        "6px",
                      height:       "6px",
                      borderRadius: "50%",
                      background:   state.accentColor,
                      boxShadow:    `0 0 6px ${state.accentColor}`,
                    }} />
                  )}
                </h3>

                <p>{state.description}</p>
                <hr />

                {/* Task preview pulled from localStorage task data */}
                <div className="state-preview">
                  <p>
                    <strong>Last Session</strong><br />
                    {getUpcomingTaskTitle(getTasksByMood(state.title))}
                  </p>
                  <p>
                    <strong>Ready Tasks</strong><br />
                    {getTaskCountByMood(state.title)} Task/s
                  </p>
                  <p>
                    <strong>Next Task up</strong><br />
                    {getUpcomingTaskTitle(getTasksByMood(state.title))}
                  </p>
                </div>

                {/*
                  Button click does two things:
                    1. handleMoodSelect → saves mood + fires mood-change event
                    2. Link → navigates to the mood's page
                  We call handleMoodSelect on the wrapping div's button click
                  before the Link navigates, so the starfield starts transitioning
                  immediately as the page changes.
                */}
                <Link to={state.route}>
                  <button
                    className="open-btn"
                    onClick={() => handleMoodSelect(state.moodKey)}
                    style={isActive ? {
                      borderColor: state.accentColor,
                      color:       "rgba(255,255,255,0.95)",
                    } : undefined}
                  >
                    {state.buttonText}
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
