// ======================================================
// TimerPage.tsx
// ------------------------------------------------------
// Floating timer window.
// Owns timer state and connects the display and controls.
// ======================================================
import { useState, useEffect } from "react";
import TimerControls from "../Components/Timer/TimerControls";
import TimerDisplay from "../Components/Timer/TimerDisplay";

export default function TimerPage() {

    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);

    const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
    const [originalDuration, setOriginalDuration] = useState(25 * 60);

    const [isRunning, setIsRunning] = useState(false);

    useEffect(() =>
{
    if (!isRunning) return;
    const interval = setInterval(() => 
    {
        setRemainingSeconds(prev =>
        {
            if (prev <= 1) 
                {
                    setIsRunning(false);
                    return 0;
            }
            return prev - 1;
        });
    }, 1000);

    return () => clearInterval(interval);
}, [isRunning]);
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