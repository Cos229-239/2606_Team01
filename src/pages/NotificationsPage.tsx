import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ── Generic setting hook (string value, persisted to localStorage) ────────
function useSetting(key: string, defaultValue: string) {
  const [value, setValue] = useState(() => localStorage.getItem(key) ?? defaultValue);
  const set = useCallback((v: string) => {
    setValue(v);
    localStorage.setItem(key, v);
    window.dispatchEvent(new CustomEvent("notification-settings-update"));
  }, [key]);
  return [value, set] as const;
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

export default function NotificationsPage() {
  const navigate = useNavigate();

  const [timerSound, setTimerSound] = useSetting("notif-timer-sound", "none");
  const [timerFlash, setTimerFlash] = useSetting("notif-timer-flash", "true");
  const [timerWindowsNotify, setTimerWindowsNotify] = useSetting("notif-timer-windows-notify", "true");

  const flashOn = timerFlash === "true";
  const windowsNotifyOn = timerWindowsNotify === "true";

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

      <h1>Notifications</h1>

      {/* ── Timer category ───────────────────────────────────────────── */}
      <div className="glass-panel" style={{ padding: "20px", marginTop: "20px", maxWidth: "500px" }}>
        <h2>Timer</h2>
        <hr />

        {/* Sound */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ margin: "0 0 8px", fontSize: "11px", color: "rgba(180,205,255,0.6)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Sound
          </p>
          <select value={timerSound} onChange={e => setTimerSound(e.target.value)} style={{ width: "100%" }}>
            <option value="none">None</option>
          </select>
          <p style={{ margin: "6px 0 0", fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>
            Plays when a timer finishes.
          </p>
        </div>

        {/* Flash toggle */}
        <div style={{ marginBottom: "18px" }}>
          <ToggleRow
            label="Flash on Complete"
            description="Flash the timer when it finishes"
            checked={flashOn}
            onChange={v => setTimerFlash(String(v))}
          />
        </div>

        {/* Windows notify toggle */}
        <div>
          <ToggleRow
            label="Windows Notification"
            description="Notify you through Windows when your timer is complete"
            checked={windowsNotifyOn}
            onChange={v => setTimerWindowsNotify(String(v))}
          />
        </div>
      </div>
    </div>
  );
}
