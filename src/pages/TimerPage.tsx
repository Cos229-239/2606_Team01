// ======================================================
// TimerPage.tsx
// ------------------------------------------------------
// Floating timer window.
// Owns timer state and connects the display and controls.
//
// Also broadcasts countdown progress so the background
// (starfield.js) can grow the black hole effect as the
// timer approaches zero. Progress is published two ways:
//   - a same-window CustomEvent ("timer-progress"), since
//     localStorage "storage" events don't fire in the tab
//     that wrote them
//   - localStorage keys, so the effect also syncs if the
//     timer is opened in its own Electron window
// ======================================================
import { useState, useEffect, useCallback } from "react";
import TimerControls from "../Components/Timer/TimerControls";
import TimerDisplay from "../Components/Timer/TimerDisplay";

const DEFAULT_MINUTES = 25;

function broadcastTimerProgress(running: boolean, progress: number) {
    localStorage.setItem("timer-running", String(running));
    localStorage.setItem("timer-progress-value", String(progress));
    window.dispatchEvent(
        new CustomEvent("timer-progress", { detail: { running, progress } })
    );
}

// ── Timer background hook ─────────────────────────────────────────────────
function useTimerBg() {
    const [timerBg, setTimerBgState] = useState(() => localStorage.getItem("timer-background") ?? "starfield");
    const set = useCallback((v: string) => {
        setTimerBgState(v);
        localStorage.setItem("timer-background", v);
        window.dispatchEvent(new CustomEvent("timer-background-update"));
    }, []);
    return [timerBg, set] as const;
}

// ── Timer black hole hooks ────────────────────────────────────────────────
function useTimerBlackHoleSetting(key: string, defaultValue: string) {
    const [value, setValue] = useState(() => localStorage.getItem(key) ?? defaultValue);
    const set = useCallback((v: string) => {
        setValue(v);
        localStorage.setItem(key, v);
        window.dispatchEvent(new CustomEvent("timer-blackhole-update"));
    }, [key]);
    return [value, set] as const;
}

export default function TimerPage() {
    const [minutes, setMinutes] = useState(DEFAULT_MINUTES);
    const [seconds, setSeconds] = useState(0);

    const [remainingSeconds, setRemainingSeconds] = useState(DEFAULT_MINUTES * 60);
    const [originalDuration, setOriginalDuration] = useState(DEFAULT_MINUTES * 60);

    const [isRunning, setIsRunning] = useState(false);

    // Timer background & effects settings
    const [timerBg, setTimerBg] = useTimerBg();
    const [timerBlackHole, setTimerBlackHole] = useTimerBlackHoleSetting("timer-blackhole", "true");
    const [timerBlackHoleJets, setTimerBlackHoleJets] = useTimerBlackHoleSetting("timer-blackhole-jets", "true");

    // Countdown tick
    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setRemainingSeconds(prev => {
                if (prev <= 1) {
                    setIsRunning(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning]);

    // Broadcast progress whenever running state or remaining time changes
    useEffect(() => {
        const progress = originalDuration > 0
            ? 1 - remainingSeconds / originalDuration
            : 0;
        broadcastTimerProgress(isRunning, progress);
    }, [isRunning, remainingSeconds, originalDuration]);

    // Reset broadcast when window closes
    useEffect(() => {
        return () => broadcastTimerProgress(false, 0);
    }, []);

    // =========================
    // SYNC HELPERS
    // =========================
    function updateFromInputs(newMinutes: number, newSeconds: number) {
        const total = newMinutes * 60 + newSeconds;
        setMinutes(newMinutes);
        setSeconds(newSeconds);
        setRemainingSeconds(total);
        setOriginalDuration(total);
    }

    function handleMinutesChange(value: number) {
        updateFromInputs(value, seconds);
    }

    function handleSecondsChange(value: number) {
        updateFromInputs(minutes, value);
    }

    function handleStart() { setIsRunning(true); }
    function handlePause() { setIsRunning(false); }
    function handleReset() {
        setRemainingSeconds(originalDuration);
        setIsRunning(false);
    }

    const bgOptions = [
        { value: "starfield", label: "Starfield" },
        { value: "city",      label: "City" },
        { value: "gradient",  label: "Gradient" },
    ];

    return (
        <div className="timer-page">
            {/* ── Settings top bar ── */}
            <div className="timer-settings-bar">
                {/* Background selector */}
                <div className="timer-settings-group">
                    <span className="timer-settings-label">Bg</span>
                    <div className="timer-settings-pills">
                        {bgOptions.map(opt => (
                            <button
                                key={opt.value}
                                className={`timer-pill${timerBg === opt.value ? " timer-pill--active" : ""}`}
                                onClick={() => setTimerBg(opt.value)}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Black hole + jets — only relevant for starfield */}
                {timerBg === "starfield" && (
                    <>
                        <div className="timer-settings-sep" />

                        <div className="timer-settings-group">
                            <span className="timer-settings-label">Black Hole</span>
                            <button
                                className={`timer-pill${timerBlackHole === "true" ? " timer-pill--active" : ""}`}
                                onClick={() => setTimerBlackHole(timerBlackHole === "true" ? "false" : "true")}
                            >
                                {timerBlackHole === "true" ? "On" : "Off"}
                            </button>
                        </div>

                        {timerBlackHole === "true" && (
                            <>
                                <div className="timer-settings-sep" />
                                <div className="timer-settings-group">
                                    <span className="timer-settings-label">Jets</span>
                                    <button
                                        className={`timer-pill${timerBlackHoleJets === "true" ? " timer-pill--active" : ""}`}
                                        onClick={() => setTimerBlackHoleJets(timerBlackHoleJets === "true" ? "false" : "true")}
                                    >
                                        {timerBlackHoleJets === "true" ? "On" : "Off"}
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>

            <TimerDisplay remainingSeconds={remainingSeconds} />

            <TimerControls
                minutes={minutes}
                seconds={seconds}
                isRunning={isRunning}
                onMinutesChange={handleMinutesChange}
                onSecondsChange={handleSecondsChange}
                onStart={handleStart}
                onPause={handlePause}
                onReset={handleReset}
            />
        </div>
    );
}
