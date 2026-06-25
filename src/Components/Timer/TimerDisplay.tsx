// ======================================================
// TimerDisplay.tsx
// ------------------------------------------------------
// Displays the remaining time.
// ======================================================

import { formatTime } from "./FormatTime";
import {  useEffect, useRef, useState } from "react";


type TimerDisplayProps =
{
    remainingSeconds: number; 
    minutes: number;
    seconds: number;

     onEditSave: (minutesValue: number, secondsValue: number) => void;
};




export default function TimerDisplay({
    remainingSeconds,
    minutes,
    seconds,
    onEditSave,
}: TimerDisplayProps)
        { 
        const [minutesInputValue, setMinutesInputValue] = useState(String(minutes));
        const [secondsInputValue, setSecondsInputValue] = useState(String(seconds));

        const containerReference = useRef<HTMLDivElement>(null);

        // Keep inputs synced when external values change
        useEffect(() =>
        {
            setMinutesInputValue(String(minutes));
            setSecondsInputValue(String(seconds));
        }, [minutes, seconds]);

        function commitChanges()
        {
            const parsedMinutes = parseInt(minutesInputValue || "0", 10);
            const parsedSeconds = parseInt(secondsInputValue || "0", 10);

            const clampedMinutes = Math.max(0, parsedMinutes);
            const clampedSeconds = Math.min(59, Math.max(0, parsedSeconds));

            onEditSave(clampedMinutes, clampedSeconds);
        }

        function handleKeyDown(event: React.KeyboardEvent)
        {
            if (event.key === "Enter")
            {
                commitChanges();
            }
        }

        function handleContainerBlur(event: React.FocusEvent)
        {
            const nextFocusedElement = event.relatedTarget as Node | null;

            if (!containerReference.current?.contains(nextFocusedElement))
            {
                commitChanges();
            }
        }

        return (
            <div
            ref={containerReference}
            className="timer-display"
            onBlur={handleContainerBlur}
        >
            <input
                value={minutesInputValue}
                onChange={(event) =>
                {
                    const inputValue = event.target.value;

                    if (/^\d*$/.test(inputValue))
                    {
                        setMinutesInputValue(inputValue);
                    }
                }}
                onKeyDown={handleKeyDown}
                onFocus={(event) => event.target.select()}
                className="timer-input"
            />

            <span> : </span>

            <input
                value={secondsInputValue}
                onChange={(event) =>
                {
                    const inputValue = event.target.value;

                    if (/^\d*$/.test(inputValue))
                    {
                        setSecondsInputValue(inputValue);
                    }
                }}
                onKeyDown={handleKeyDown}
                onFocus={(event) => event.target.select()}
                className="timer-input"
            />

            <div style={{ fontSize: 12, opacity: 0.5 }}>
                Press Enter to save or click outside to save
            </div>
        </div>
    );
}