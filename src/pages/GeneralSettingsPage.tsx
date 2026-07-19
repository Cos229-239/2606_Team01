// ======================================================
// GeneralSettingsPage.tsx
// ------------------------------------------------------
// Settings > General.
// Two panels: "Confirm before deleting", which guards
// deleting a notebook, page, block, or task from within
// the Notebook/Journey editors and the task list pages,
// and "Motion", which controls whether navigation and
// UI transitions (Help page quick-nav, accordions,
// dropdowns) animate or snap instantly. Follows the same
// page layout / local-hook conventions as
// AppearancePage.tsx / NotificationsPage.tsx.
// ======================================================
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GENERAL_SETTINGS_KEYS, GENERAL_SETTINGS_DEFAULTS } from "../Data/generalSettings";
import { SMOOTH_SCROLL_CHANGE_EVENT } from "../Data/useSmoothScroll";

// ── Local setting hook (mirrors AppearancePage's / NotificationsPage's pattern) ─
function useLocalSetting(key: string, defaultValue: string) {
    const [value, setValue] = useState(() => localStorage.getItem(key) ?? defaultValue);
    const set = useCallback((v: string) => {
        setValue(v);
        localStorage.setItem(key, v);
    }, [key]);
    return [value, set] as const;
}

// ── Reusable toggle row (same look as AppearancePage's / NotificationsPage's ToggleRow) ─
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

export default function GeneralSettingsPage() {
    const navigate = useNavigate();

    const [confirmBeforeDelete, setConfirmBeforeDelete] = useLocalSetting(
        GENERAL_SETTINGS_KEYS.confirmBeforeDelete,
        GENERAL_SETTINGS_DEFAULTS.confirmBeforeDelete
    );

    const [smoothScroll, setSmoothScrollRaw] = useLocalSetting(
        GENERAL_SETTINGS_KEYS.smoothScroll,
        GENERAL_SETTINGS_DEFAULTS.smoothScroll
    );

    // Wrap the setter so other mounted pages (e.g. Help's quick-nav, any
    // open accordion) pick up the change immediately instead of only on
    // next visit/reload.
    function setSmoothScroll(v: string) {
        setSmoothScrollRaw(v);
        window.dispatchEvent(new CustomEvent(SMOOTH_SCROLL_CHANGE_EVENT));
    }

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

            <h1>General</h1>

            {/* ── Deletion panel ───────────────────────────────────────── */}
            <div className="glass-panel" style={{ padding: "20px", marginTop: "20px", maxWidth: "500px" }}>
                <h2>Deletion</h2>
                <hr />
                <ToggleRow
                    label="Confirm before deleting"
                    description="Ask for confirmation before deleting a notebook, page, block, or task"
                    checked={confirmBeforeDelete === "true"}
                    onChange={v => setConfirmBeforeDelete(String(v))}
                />
            </div>

            {/* ── Motion panel ─────────────────────────────────────────── */}
            <div className="glass-panel" style={{ padding: "20px", marginTop: "20px", maxWidth: "500px" }}>
                <h2>Motion</h2>
                <hr />
                <ToggleRow
                    label="Smooth scrolling"
                    description="Animate scrolling to a section (like the Help page's quick-nav) and the opening of accordions and dropdowns, instead of having them snap into place instantly"
                    checked={smoothScroll === "true"}
                    onChange={v => setSmoothScroll(String(v))}
                />
            </div>
        </div>
    );
}
