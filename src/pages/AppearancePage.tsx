import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function useSetting(key: string, defaultValue: string) {
  const [value, setValue] = useState(() => localStorage.getItem(key) ?? defaultValue);
  useEffect(() => {
    localStorage.setItem(key, value);
    window.dispatchEvent(new CustomEvent("starfield-update"));
  }, [key, value]);
  return [value, setValue] as const;
}

export default function AppearancePage() {
  const navigate = useNavigate();
  const [scroll,     setScroll]     = useSetting("star-scroll",      "false");
  const [mouseLook,  setMouseLook]  = useSetting("star-mouselook",   "true");
  const [scrollSpeed, setScrollSpeed] = useSetting("star-scroll-speed", "3");

  const scrollOn    = scroll === "true";
  const mouseLookOn = mouseLook === "true";

  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => navigate("/settings")}
        style={{
          background: "transparent",
          border: "none",
          color: "rgba(160,190,255,0.7)",
          fontSize: "13px",
          cursor: "pointer",
          padding: "0 0 18px 0",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          boxShadow: "none",
        }}
      >
        ‹ Back to Settings
      </button>

      <h1>Appearance</h1>

      <div className="glass-panel" style={{ padding: "20px", marginTop: "20px", maxWidth: "500px" }}>
        <h2>Starfield</h2>
        <hr />

        {/* Mouse Look */}
        <ToggleRow
          label="Mouse Look"
          description="Stars shift with your cursor position"
          checked={mouseLookOn}
          onChange={v => setMouseLook(String(v))}
        />

        <div style={{ height: "14px" }} />

        {/* Auto Scroll */}
        <ToggleRow
          label="Auto-Scroll"
          description="Stars slowly drift across the background"
          checked={scrollOn}
          onChange={v => setScroll(String(v))}
        />

        {/* Speed slider — only when scroll on */}
        {scrollOn && (
          <div style={{ marginTop: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <p style={{ margin: 0, fontSize: "11px", color: "rgba(180,205,255,0.6)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Scroll Speed
              </p>
              <p style={{ margin: 0, fontSize: "11px", color: "rgba(200,220,255,0.8)" }}>
                {parseFloat(scrollSpeed) > 0 ? `+${scrollSpeed}` : scrollSpeed}
              </p>
            </div>
            <input
              type="range"
              min="-5"
              max="10"
              step="0.5"
              value={scrollSpeed}
              onChange={e => setScrollSpeed(e.target.value)}
              style={{ width: "100%", accentColor: "rgba(120,160,255,0.9)" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Reusable toggle row ───────────────────────────────────────────────────
function ToggleRow({ label, description, checked, onChange }: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <p style={{ margin: 0, color: "rgba(220,235,255,0.9)", fontSize: "13px" }}>{label}</p>
        <p style={{ margin: "2px 0 0", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{description}</p>
      </div>
      <label style={{ cursor: "pointer", flexShrink: 0 }}>
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ display: "none" }} />
        <span style={{
          display: "inline-flex", alignItems: "center",
          width: "44px", height: "24px", borderRadius: "12px",
          background: checked ? "rgba(120,160,255,0.7)" : "rgba(255,255,255,0.12)",
          transition: "background 0.2s", position: "relative",
        }}>
          <span style={{
            position: "absolute",
            width: "20px", height: "20px", borderRadius: "50%",
            background: "#fff",
            transition: "transform 0.2s",
            transform: checked ? "translateX(20px)" : "translateX(2px)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
          }} />
        </span>
      </label>
    </div>
  );
}
