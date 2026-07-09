// ======================================================
// NotificationsPage.tsx
// ------------------------------------------------------
// Settings > Notifications.
// Lets the user pick a synthesized preset sound (or a
// custom file), preview it, and set the playback volume.
// Follows the same page layout / local-hook conventions as
// AppearancePage.tsx.
// ======================================================
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PRESET_LIST, PRESETS, playPreset } from "../Data/soundPresets";
import type { NotificationSoundPreset } from "../Data/soundPresets";
import { NOTIF_SOUND_KEYS, NOTIF_SOUND_DEFAULTS, NOTIF_BEHAVIOR_KEYS, NOTIF_BEHAVIOR_DEFAULTS } from "../Data/notificationSettings";
import { playCustomFile } from "../Data/notificationSound";

// ── Local setting hooks (mirrors AppearancePage's pattern) ────────────────
function useLocalSetting(key: string, defaultValue: string) {
    const [value, setValue] = useState(() => localStorage.getItem(key) ?? defaultValue);
    const set = useCallback((v: string) => {
        setValue(v);
        localStorage.setItem(key, v);
    }, [key]);
    return [value, set] as const;
}

// ── Reusable toggle row (same look as AppearancePage's ToggleRow) ─────────
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

    const [enabled,    setEnabled]    = useLocalSetting(NOTIF_SOUND_KEYS.enabled,    NOTIF_SOUND_DEFAULTS.enabled);
    const [preset,     setPreset]     = useLocalSetting(NOTIF_SOUND_KEYS.preset,     NOTIF_SOUND_DEFAULTS.preset);
    const [volume,     setVolume]     = useLocalSetting(NOTIF_SOUND_KEYS.volume,     NOTIF_SOUND_DEFAULTS.volume);
    const [useCustom,  setUseCustom]  = useLocalSetting(NOTIF_SOUND_KEYS.useCustom,  NOTIF_SOUND_DEFAULTS.useCustom);
    const [customPath, setCustomPath] = useLocalSetting(NOTIF_SOUND_KEYS.customPath, NOTIF_SOUND_DEFAULTS.customPath);

    const [flashEnabled, setFlashEnabled] = useLocalSetting(NOTIF_BEHAVIOR_KEYS.flashEnabled, NOTIF_BEHAVIOR_DEFAULTS.flashEnabled);
    const [osEnabled,    setOsEnabled]    = useLocalSetting(NOTIF_BEHAVIOR_KEYS.osNotificationEnabled, NOTIF_BEHAVIOR_DEFAULTS.osNotificationEnabled);

    const isEnabled = enabled === "true";
    const isCustom = useCustom === "true";
    const vol = parseFloat(volume);

    async function handleChooseFile() {
        if (!window.electron?.selectAudioFile) {
            console.warn("[NotificationsPage] file picker unavailable outside Electron.");
            return;
        }
        const path = await window.electron.selectAudioFile();
        if (path) setCustomPath(path);
    }

    function handlePreviewPreset(p: NotificationSoundPreset) {
        playPreset(p, vol);
    }

    function handlePreviewCustom() {
        if (!customPath) return;
        playCustomFile(customPath, vol);
    }

    const fileName = customPath ? customPath.split(/[/\\]/).pop() : "";

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

            {/* ── On Timer Finish panel ───────────────────────────────── */}
            <div className="glass-panel" style={{ padding: "20px", marginTop: "20px", maxWidth: "500px" }}>
                <h2>On Timer Finish</h2>
                <hr />
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                    <ToggleRow
                        label="Windows Notification"
                        description="Shows a native OS popup when the timer completes"
                        checked={osEnabled === "true"}
                        onChange={v => setOsEnabled(String(v))}
                    />
                    <ToggleRow
                        label="Screen Flash"
                        description="Flashes/glows the timer window when it completes"
                        checked={flashEnabled === "true"}
                        onChange={v => setFlashEnabled(String(v))}
                    />
                </div>
            </div>

            {/* ── Sound panel ──────────────────────────────────────────── */}
            <div className="glass-panel" style={{ padding: "20px", marginTop: "16px", maxWidth: "500px" }}>
                <h2>Timer Sound</h2>
                <hr />
                <p style={{ margin: "0 0 16px", fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>
                    Plays whenever a timer finishes.
                </p>

                <ToggleRow
                    label="Play a sound"
                    description="Turn off to rely on the visual/OS notification only"
                    checked={isEnabled}
                    onChange={v => setEnabled(String(v))}
                />

                {isEnabled && (
                    <>
                        {/* Preset vs custom toggle */}
                        <div style={{ display: "flex", gap: "10px", margin: "20px 0 16px" }}>
                            {[
                                { key: "preset", label: "Preset" },
                                { key: "custom", label: "Custom file" },
                            ].map(opt => {
                                const active = (opt.key === "custom") === isCustom;
                                return (
                                    <button
                                        key={opt.key}
                                        onClick={() => setUseCustom(opt.key === "custom" ? "true" : "false")}
                                        style={{
                                            flex: 1, padding: "8px 0", borderRadius: "8px", fontSize: "12px",
                                            cursor: "pointer",
                                            background: active ? "rgba(120,160,255,0.18)" : "rgba(255,255,255,0.03)",
                                            border: `1px solid ${active ? "rgba(120,160,255,0.45)" : "rgba(255,255,255,0.08)"}`,
                                            color: active ? "rgba(220,235,255,0.95)" : "rgba(255,255,255,0.5)",
                                            transition: "all 0.2s",
                                        }}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>

                        {!isCustom && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {PRESET_LIST.map(p => {
                                    const def = PRESETS[p];
                                    const active = preset === p;
                                    return (
                                        <div
                                            key={p}
                                            onClick={() => setPreset(p)}
                                            style={{
                                                display: "flex", alignItems: "center", gap: "12px",
                                                padding: "12px 14px", borderRadius: "10px", cursor: "pointer",
                                                background: active ? "rgba(120,160,255,0.10)" : "rgba(255,255,255,0.03)",
                                                border: `1px solid ${active ? "rgba(120,160,255,0.45)" : "rgba(255,255,255,0.08)"}`,
                                                transition: "all 0.25s",
                                            }}
                                        >
                                            <span style={{
                                                width: "9px", height: "9px", borderRadius: "50%", flexShrink: 0,
                                                background: active ? "rgba(120,160,255,0.9)" : "rgba(255,255,255,0.15)",
                                                boxShadow: active ? "0 0 6px rgba(120,160,255,0.7)" : "none",
                                            }} />
                                            <div style={{ flex: 1 }}>
                                                <p style={{ margin: 0, fontSize: "13px", color: "rgba(220,235,255,0.9)", fontWeight: 500 }}>
                                                    {def.label}
                                                </p>
                                            </div>
                                            <button
                                                onClick={e => { e.stopPropagation(); handlePreviewPreset(p); }}
                                                style={{
                                                    flexShrink: 0, width: "30px", height: "30px", borderRadius: "50%",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                                                    color: "rgba(220,235,255,0.85)", cursor: "pointer", fontSize: "12px",
                                                }}
                                                title="Preview"
                                            >
                                                ▶
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {isCustom && (
                            <div style={{
                                padding: "14px 16px", borderRadius: "10px",
                                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                            }}>
                                <p style={{ margin: "0 0 10px", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                                    {fileName ? fileName : "No file selected"}
                                </p>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button
                                        onClick={handleChooseFile}
                                        style={{
                                            flex: 1, padding: "8px 0", borderRadius: "8px", fontSize: "12px",
                                            background: "rgba(120,160,255,0.14)", border: "1px solid rgba(160,190,255,0.35)",
                                            color: "rgba(220,235,255,0.9)", cursor: "pointer",
                                        }}
                                    >
                                        Choose File…
                                    </button>
                                    <button
                                        onClick={handlePreviewCustom}
                                        disabled={!customPath}
                                        style={{
                                            width: "44px", borderRadius: "8px", fontSize: "12px",
                                            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                                            color: "rgba(220,235,255,0.85)",
                                            cursor: customPath ? "pointer" : "default",
                                            opacity: customPath ? 1 : 0.4,
                                        }}
                                        title="Preview"
                                    >
                                        ▶
                                    </button>
                                </div>
                                <p style={{ margin: "10px 0 0", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
                                    MP3, WAV, OGG, M4A, FLAC and AAC files are supported.
                                </p>
                            </div>
                        )}

                        {/* Volume */}
                        <div style={{ marginTop: "20px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                                <p style={{ margin: 0, fontSize: "11px", color: "rgba(180,205,255,0.6)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                                    Volume
                                </p>
                                <p style={{ margin: 0, fontSize: "11px", color: "rgba(200,220,255,0.8)" }}>
                                    {Math.round(vol * 100)}%
                                </p>
                            </div>
                            <input
                                type="range" min="0" max="1" step="0.01"
                                value={volume}
                                onChange={e => setVolume(e.target.value)}
                                style={{ width: "100%", accentColor: "rgba(120,160,255,0.9)" }}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
