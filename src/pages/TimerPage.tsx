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
import { useState, useEffect, useCallback, useRef } from "react";
import TimerControls from "../Components/Timer/TimerControls";
import { formatTime } from "../Components/Timer/FormatTime";
import { playNotificationSound } from "../Data/notificationSound";
import { getNotificationBehaviorSettings } from "../Data/notificationSettings";

const DEFAULT_MINUTES = 25;

// Fires the "timer finished" notification. Goes through the Electron
// bridge when it's available (real desktop popup, no sound yet — see
// preload.cjs / main.js). Falls back to the browser Notification API
// so this still does something sensible when the timer page is opened
// in a plain browser tab during development.
function notifyTimerFinished(originalDuration: number)
{
    const body = originalDuration > 0
        ? `Your ${formatTime(originalDuration)} timer is up.`
        : "Time's up.";

    console.log("[renderer] notifyTimerFinished fired. window.electron present:", !!window.electron);

    if (window.electron?.notifyTimerComplete)
    {
        window.electron.notifyTimerComplete({ title: "Timer finished", body });
        return;
    }

    console.log("[renderer] falling back to browser Notification API. permission:", typeof Notification !== "undefined" ? Notification.permission : "Notification unavailable");

    if (typeof Notification === "undefined") return;

    if (Notification.permission === "granted")
    {
        new Notification("Timer finished", { body });
    }
    else if (Notification.permission !== "denied")
    {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") new Notification("Timer finished", { body });
        });
    }
}

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
    const [remainingSeconds, setRemainingSeconds] = useState(DEFAULT_MINUTES * 60);
    const [originalDuration, setOriginalDuration] = useState(DEFAULT_MINUTES * 60);

    const [isRunning, setIsRunning] = useState(false);

    // Brief "just finished" visual state -- drives a few seconds of
    // flash/glow on the display, then settles back down on its own
    // (see .timer-complete in App.css). Not a persistent banner; the
    // OS notification is what sticks around.
    const [justCompleted, setJustCompleted] = useState(false);

    // Guards against notifying more than once for the same run --
    // without this, the completion effect below could double-fire
    // (e.g. under React StrictMode double-invoke in dev).
    const hasNotifiedRef = useRef(false);

    // Tracks whether the countdown has actually been started at least
    // once for the current duration. Without this, simply dialing the
    // timer to 00:00 (or landing on 0 via a reset) makes remainingSeconds
    // hit 0 with nothing having run, which would otherwise fire a
    // "timer finished" notification for a timer that never started.
    const hasStartedRef = useRef(false);

    // Timer background & effects settings
    const [timerBg, setTimerBg] = useTimerBg();
    const [timerBlackHole, setTimerBlackHole] = useTimerBlackHoleSetting("timer-blackhole", "true");
    const [timerBlackHoleParticles, setTimerBlackHoleParticles] = useTimerBlackHoleSetting("timer-blackhole-particles", "true");

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

    // Fire the completion notification + visual flash the moment the
    // countdown reaches zero. Separate from the tick effect above so it
    // only ever runs once per completion, however remainingSeconds got
    // to 0.
    useEffect(() => {
        if (remainingSeconds === 0) {
            if (hasStartedRef.current && !hasNotifiedRef.current) {
                hasNotifiedRef.current = true;
                const { flashEnabled, osNotificationEnabled } = getNotificationBehaviorSettings();
                setJustCompleted(flashEnabled);
                if (osNotificationEnabled) notifyTimerFinished(originalDuration);
                playNotificationSound();
            }
        } else {
            hasNotifiedRef.current = false;
        }
    }, [remainingSeconds, originalDuration]);

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
    function handleTimeChange(newTotalSeconds: number) {
        setJustCompleted(false);
        setRemainingSeconds(newTotalSeconds);
        setOriginalDuration(newTotalSeconds);
        // Picking a new duration (including 00:00) means nothing has
        // run yet for it -- don't let a stale "started" flag from a
        // previous run trigger a notification.
        hasStartedRef.current = false;
    }

    function handleStart() { setJustCompleted(false); setIsRunning(true); hasStartedRef.current = true; }
    function handlePause() { setIsRunning(false); }
    function handleReset() {
        setJustCompleted(false);
        setRemainingSeconds(originalDuration);
        setIsRunning(false);
        hasStartedRef.current = false;
    }

    const bgOptions = [
        { value: "starfield", label: "Starfield" },
        { value: "city",      label: "City" },
        { value: "gradient",  label: "Gradient" },
    ];

    return (
        <div className={`timer-page${justCompleted ? " timer-complete" : ""}`}>
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

                {/* Black hole + particles — only relevant for starfield */}
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
                                    <span className="timer-settings-label">Particles</span>
                                    <button
                                        className={`timer-pill${timerBlackHoleParticles === "true" ? " timer-pill--active" : ""}`}
                                        onClick={() => setTimerBlackHoleParticles(timerBlackHoleParticles === "true" ? "false" : "true")}
                                    >
                                        {timerBlackHoleParticles === "true" ? "On" : "Off"}
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>

            <TimerControls
                totalSeconds={remainingSeconds}
                isRunning={isRunning}
                onTimeChange={handleTimeChange}
                onStart={handleStart}
                onPause={handlePause}
                onReset={handleReset}
            />
        </div>
    );
}
