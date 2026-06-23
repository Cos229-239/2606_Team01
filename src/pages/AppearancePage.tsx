import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ── Generic setting hook ──────────────────────────────────────────────────
function useSetting(key: string, defaultValue: string) {
  const [value, setValue] = useState(() => localStorage.getItem(key) ?? defaultValue);
  useEffect(() => {
    localStorage.setItem(key, value);
    window.dispatchEvent(new CustomEvent("starfield-update"));
  }, [key, value]);
  return [value, setValue] as const;
}

// ── Tint setting hook (fires starfield-update so tint updates live) ───────
function useTintSetting(key: string, defaultValue: string) {
  const [value, setValue] = useState(() => localStorage.getItem(key) ?? defaultValue);
  const set = useCallback((v: string) => {
    setValue(v);
    localStorage.setItem(key, v);
    window.dispatchEvent(new CustomEvent("starfield-update"));
  }, [key]);
  return [value, set] as const;
}

// ── Mood config (must match stateCards in CongruencePage) ─────────────────
const MOODS = [
  { key: "Focused",  label: "Focused",  accent: "rgba(100,160,255,0.8)" },
  { key: "Planning", label: "Planning", accent: "rgba(255,180,60,0.8)"  },
  { key: "Recharge", label: "Recharge", accent: "rgba(60,220,160,0.8)" },
];

// ── Colour wheel (hue ring SVG) ───────────────────────────────────────────
function HueRing({ hue, onChange, size = 160 }: {
  hue: number;
  onChange: (h: number) => void;
  size?: number;
}) {
  const cx = size / 2;
  const outerR = size / 2;
  const innerR = outerR * 0.62;

  function handleInteraction(e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) {
    const svg = e.currentTarget.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const dx = clientX - (svg.left + cx);
    const dy = clientY - (svg.top + cx);
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < innerR * 0.8 || dist > outerR + 10) return;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    onChange(Math.round(angle) % 360);
  }

  // Draw 360 conic gradient segments as SVG arcs
  const segments = 60;
  const paths: string[] = [];
  for (let i = 0; i < segments; i++) {
    const a1 = (i / segments) * 360;
    const a2 = ((i + 1) / segments) * 360;
    const toRad = (d: number) => (d - 90) * (Math.PI / 180);
    const x1o = cx + outerR * Math.cos(toRad(a1));
    const y1o = cx + outerR * Math.sin(toRad(a1));
    const x2o = cx + outerR * Math.cos(toRad(a2));
    const y2o = cx + outerR * Math.sin(toRad(a2));
    const x1i = cx + innerR * Math.cos(toRad(a1));
    const y1i = cx + innerR * Math.sin(toRad(a1));
    const x2i = cx + innerR * Math.cos(toRad(a2));
    const y2i = cx + innerR * Math.sin(toRad(a2));
    const h = (a1 + a2) / 2;
    paths.push(
      `<path d="M${x1o},${y1o} A${outerR},${outerR} 0 0,1 ${x2o},${y2o} L${x2i},${y2i} A${innerR},${innerR} 0 0,0 ${x1i},${y1i} Z" fill="hsl(${h},90%,55%)" />`
    );
  }

  // Selector handle
  const selRad = (hue - 90) * (Math.PI / 180);
  const handleR = (outerR + innerR) / 2;
  const hx = cx + handleR * Math.cos(selRad);
  const hy = cx + handleR * Math.sin(selRad);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ cursor: "crosshair", userSelect: "none", touchAction: "none" }}
      onMouseDown={handleInteraction}
      onMouseMove={e => { if (e.buttons === 1) handleInteraction(e); }}
      onTouchStart={handleInteraction}
      onTouchMove={handleInteraction}
      dangerouslySetInnerHTML={{
        __html:
          paths.join("") +
          // inner mask circle (transparent hole)
          `<circle cx="${cx}" cy="${cx}" r="${innerR * 0.98}" fill="transparent" />` +
          // selector dot
          `<circle cx="${hx}" cy="${hy}" r="7" fill="hsl(${hue},90%,60%)" stroke="#fff" stroke-width="2" style="filter:drop-shadow(0 0 4px rgba(0,0,0,0.6))" />`,
      }}
    />
  );
}

// ── Per-mood tint section ─────────────────────────────────────────────────
function MoodTintRow({ moodKey, label, accent }: {
  moodKey: string;
  label: string;
  accent: string;
}) {
  const [enabled, setEnabled] = useTintSetting(`tint-${moodKey}-enabled`, "false");
  const [hue,     setHue]     = useTintSetting(`tint-${moodKey}-h`,       "200");
  const [strength, setStrength] = useTintSetting(`tint-${moodKey}-s`,     "0.5");

  const isOn = enabled === "true";

  return (
    <div style={{
      padding: "14px 16px",
      borderRadius: "10px",
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${isOn ? accent : "rgba(255,255,255,0.08)"}`,
      transition: "border-color 0.3s",
      marginBottom: "10px",
    }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isOn ? "14px" : 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            width: "8px", height: "8px", borderRadius: "50%",
            background: accent, display: "inline-block",
          }} />
          <p style={{ margin: 0, color: "rgba(220,235,255,0.9)", fontSize: "13px" }}>{label}</p>
        </div>
        <label style={{ cursor: "pointer", flexShrink: 0 }}>
          <input type="checkbox" checked={isOn} onChange={e => setEnabled(String(e.target.checked))} style={{ display: "none" }} />
          <span style={{
            display: "inline-flex", alignItems: "center",
            width: "40px", height: "22px", borderRadius: "11px",
            background: isOn ? "rgba(120,160,255,0.7)" : "rgba(255,255,255,0.12)",
            transition: "background 0.2s", position: "relative",
          }}>
            <span style={{
              position: "absolute", width: "18px", height: "18px", borderRadius: "50%",
              background: "#fff", transition: "transform 0.2s",
              transform: isOn ? "translateX(19px)" : "translateX(2px)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
            }} />
          </span>
        </label>
      </div>

      {isOn && (
        <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
          <HueRing hue={parseInt(hue)} onChange={h => setHue(String(h))} size={130} />
          <div style={{ flex: 1, minWidth: "120px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <p style={{ margin: 0, fontSize: "11px", color: "rgba(180,205,255,0.6)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Strength</p>
              <p style={{ margin: 0, fontSize: "11px", color: "rgba(200,220,255,0.8)" }}>{Math.round(parseFloat(strength) * 100)}%</p>
            </div>
            <input
              type="range" min="0" max="1" step="0.01"
              value={strength}
              onChange={e => setStrength(e.target.value)}
              style={{ width: "100%", accentColor: `hsl(${hue}, 80%, 55%)` }}
            />
            {/* Hue preview swatch */}
            <div style={{
              marginTop: "12px", height: "28px", borderRadius: "6px",
              background: `hsl(${hue}, 80%, 50%)`,
              opacity: Math.min(0.35, parseFloat(strength) * 0.35) * 3 + 0.15,
              border: "1px solid rgba(255,255,255,0.1)",
            }} />
            <p style={{ margin: "6px 0 0", fontSize: "10px", color: "rgba(255,255,255,0.3)", textAlign: "center" }}>
              Hue {hue}°
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function AppearancePage() {
  const navigate = useNavigate();

  // Starfield settings
  const [scroll,      setScroll]      = useSetting("star-scroll",       "false");
  const [mouseLook,   setMouseLook]   = useSetting("star-mouselook",    "true");
  const [scrollSpeed, setScrollSpeed] = useSetting("star-scroll-speed", "3");

  // Default tint settings
  const [defaultHue,      setDefaultHue]      = useTintSetting("tint-default-h", "220");
  const [defaultStrength, setDefaultStrength] = useTintSetting("tint-default-s", "0");

  const scrollOn    = scroll === "true";
  const mouseLookOn = mouseLook === "true";
  const dHue = parseInt(defaultHue);
  const dStr = parseFloat(defaultStrength);

  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => navigate("/settings")}
        style={{
          background: "transparent", border: "none",
          color: "rgba(160,190,255,0.7)", fontSize: "13px",
          cursor: "pointer", padding: "0 0 18px 0",
          display: "flex", alignItems: "center", gap: "6px", boxShadow: "none",
        }}
      >
        ‹ Back to Settings
      </button>

      <h1>Appearance</h1>

      {/* ── Starfield panel ──────────────────────────────────────────── */}
      <div className="glass-panel" style={{ padding: "20px", marginTop: "20px", maxWidth: "500px" }}>
        <h2>Starfield</h2>
        <hr />

        <ToggleRow
          label="Mouse Look"
          description="Stars shift with your cursor position"
          checked={mouseLookOn}
          onChange={v => setMouseLook(String(v))}
        />
        <div style={{ height: "14px" }} />
        <ToggleRow
          label="Auto-Scroll"
          description="Stars slowly drift across the background"
          checked={scrollOn}
          onChange={v => setScroll(String(v))}
        />

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
              type="range" min="-5" max="10" step="0.5"
              value={scrollSpeed}
              onChange={e => setScrollSpeed(e.target.value)}
              style={{ width: "100%", accentColor: "rgba(120,160,255,0.9)" }}
            />
          </div>
        )}
      </div>

      {/* ── Screen Color panel ───────────────────────────────────────── */}
      <div className="glass-panel" style={{ padding: "20px", marginTop: "16px", maxWidth: "500px" }}>
        <h2>Screen Color</h2>
        <hr />
        <p style={{ margin: "0 0 16px", fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>
          Overlay a colour tint on the screen. Set a global default, or customize per mood.
        </p>

        {/* Default tint */}
        <p style={{ margin: "0 0 10px", fontSize: "11px", color: "rgba(180,205,255,0.6)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Default
        </p>
        <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap", marginBottom: "24px" }}>
          <HueRing hue={dHue} onChange={h => setDefaultHue(String(h))} size={140} />
          <div style={{ flex: 1, minWidth: "130px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <p style={{ margin: 0, fontSize: "11px", color: "rgba(180,205,255,0.6)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Strength</p>
              <p style={{ margin: 0, fontSize: "11px", color: "rgba(200,220,255,0.8)" }}>{Math.round(dStr * 100)}%</p>
            </div>
            <input
              type="range" min="0" max="1" step="0.01"
              value={defaultStrength}
              onChange={e => setDefaultStrength(e.target.value)}
              style={{ width: "100%", accentColor: `hsl(${dHue}, 80%, 55%)` }}
            />
            <div style={{
              marginTop: "12px", height: "28px", borderRadius: "6px",
              background: `hsl(${dHue}, 80%, 50%)`,
              opacity: Math.min(0.35, dStr * 0.35) * 3 + 0.15,
              border: "1px solid rgba(255,255,255,0.1)",
            }} />
            <p style={{ margin: "6px 0 0", fontSize: "10px", color: "rgba(255,255,255,0.3)", textAlign: "center" }}>
              {dStr === 0 ? "Off" : `Hue ${dHue}°`}
            </p>
          </div>
        </div>

        {/* Per-mood tints */}
        <p style={{ margin: "0 0 10px", fontSize: "11px", color: "rgba(180,205,255,0.6)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Per Mood Override
        </p>
        {MOODS.map(m => (
          <MoodTintRow key={m.key} moodKey={m.key} label={m.label} accent={m.accent} />
        ))}
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
            position: "absolute", width: "20px", height: "20px", borderRadius: "50%",
            background: "#fff", transition: "transform 0.2s",
            transform: checked ? "translateX(20px)" : "translateX(2px)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
          }} />
        </span>
      </label>
    </div>
  );
}
