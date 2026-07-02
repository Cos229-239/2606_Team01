// ======================================================
// formatTime.ts
// ------------------------------------------------------
// Converts total seconds into a clock string.
// Shows MM:SS normally, and H:MM:SS once an hour or more
// is on the clock (so a 90-minute timer reads "1:30:00").
// ======================================================

export function formatTime(totalSeconds: number): string
{
    const clamped = Math.max(0, Math.floor(totalSeconds));

    const hours = Math.floor(clamped / 3600);
    const minutes = Math.floor((clamped % 3600) / 60);
    const seconds = clamped % 60;

    if (hours > 0)
    {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
