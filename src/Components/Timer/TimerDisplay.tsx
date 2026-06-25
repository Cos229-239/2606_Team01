// ======================================================
// TimerDisplay.tsx
// ------------------------------------------------------
// Displays the remaining time.
// ======================================================

import { formatTime } from "./FormatTime";

type TimerDisplayProps =
{
    remainingSeconds: number;
};

export default function TimerDisplay({
    remainingSeconds,
}: TimerDisplayProps)
    {
        return (
            <div className = "timer-display">
                <h1> { formatTime(remainingSeconds )} </h1>
            </div>
        );
    }