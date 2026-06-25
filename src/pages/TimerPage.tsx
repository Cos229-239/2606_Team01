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
import { useState, useEffect } from "react";
import { TimerTopControls, TimerBottomControls } from "../Components/Timer/TimerControls";
import TimerDisplay from "../Components/Timer/TimerDisplay";


const DEFAULT_MINUTES = 25;

function broadcastTimerProgress(running: boolean, progress: number) {
    localStorage.setItem("timer-running", String(running));
    localStorage.setItem("timer-progress-value", String(progress));
    window.dispatchEvent(
        new CustomEvent("timer-progress", { detail: { running, progress } })
    );
}

export default function TimerPage() {
    const [minutes, setMinutes] = useState(DEFAULT_MINUTES);
    const [seconds, setSeconds] = useState(0);

    const [remainingSeconds, setRemainingSeconds] = useState(DEFAULT_MINUTES * 60);
    const [originalDuration, setOriginalDuration] = useState(DEFAULT_MINUTES * 60);

    const [isRunning, setIsRunning] = useState(false);

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

    // Broadcast progress whenever running state or remaining time changes,
    // so the black hole background can react live.
    useEffect(() => {
        const progress = originalDuration > 0
            ? 1 - remainingSeconds / originalDuration
            : 0;
        broadcastTimerProgress(isRunning, progress);
    }, [isRunning, remainingSeconds, originalDuration]);

    // Make sure the background effect resets when this window closes.
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

    function handleStart() {
        setIsRunning(true);
    }

    function handlePause() {
        setIsRunning(false);
    }

    function handleReset() {
        setRemainingSeconds(originalDuration);
        setIsRunning(false);
    }

    return (
        <div className="timer-page">

            <div className="timer-top-controls">
                <TimerTopControls
                    minutes={minutes}
                    seconds={seconds}
                    onMinutesChange={handleMinutesChange}
                    onSecondsChange={handleSecondsChange}
                />
                </div>

                <TimerDisplay
                    remainingSeconds={remainingSeconds}
                />

                <div className="timer-bottom-controls">
                <TimerBottomControls
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

        </div>
    );
}
