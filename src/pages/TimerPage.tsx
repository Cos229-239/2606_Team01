// ======================================================
// TimerPage.tsx
// ------------------------------------------------------
// Floating timer window.
// Owns timer state and connects the display and controls.
// ======================================================
import { useState, useEffect } from "react";
import TimerControls from "../Components/Timer/TimerControls";
import TimerDisplay from "../Components/Timer/TimerDisplay";

const DEFAULT_MINUTES = 25;

export default function TimerPage()
{
    const [minutes, setMinutes] = useState(DEFAULT_MINUTES);
    const [seconds, setSeconds] = useState(0);

    const [remainingSeconds, setRemainingSeconds] =
        useState(DEFAULT_MINUTES * 60);

    const [originalDuration, setOriginalDuration] =
        useState(DEFAULT_MINUTES * 60);

    const [isRunning, setIsRunning] = useState(false);

    
    // Countdown Tick
     useEffect(() =>
{
    if (!isRunning) return;
    const interval = setInterval(() => 
    {
        setRemainingSeconds(previousSeconds =>
            {
                if (previousSeconds <= 1)
                {
                    setIsRunning(false);
                    return 0;
                }

                return previousSeconds - 1;
            });
        }, 1000);

        return () => clearInterval(interval);

    }, [isRunning]);

// Duration Helper

 function setTimerDuration(
        minutesValue: number,
        secondsValue: number
    )
    {
        const totalSeconds =
            (minutesValue * 60) + secondsValue;

        setMinutes(minutesValue);
        setSeconds(secondsValue);

        setRemainingSeconds(totalSeconds);
        setOriginalDuration(totalSeconds);
    }

    // ==================================================
    // Control Handlers
    // ==================================================

    function handleMinutesChange(value: number)
    {
        setTimerDuration(value, seconds);
    }

    function handleSecondsChange(value: number)
    {
        setTimerDuration(minutes, value);
    }

    function handleStart()
    {
        setIsRunning(true);
    }

    function handlePause()
    {
        setIsRunning(false);
    }

    function handleReset()
    {
        setRemainingSeconds(originalDuration);
        setIsRunning(false);
    }

    // ==================================================
    // Render
    // ==================================================

    return (
        <div className="timer-page">

            <TimerDisplay
                remainingSeconds={remainingSeconds}
                minutes={minutes}
                seconds={seconds}
                onEditSave={setTimerDuration}
            />

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