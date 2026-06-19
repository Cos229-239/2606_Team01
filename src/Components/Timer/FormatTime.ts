// ======================================================
// formatTime.ts
// ------------------------------------------------------
// Converts total seconds into MM:SS format.
// ======================================================

export function formatTime(totalSeconds: number): string
{
    const minutes = Math.floor(totalSeconds /60);
    const Seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, "0")}: 
    ${Seconds.toString().padStart(2, "0")}`;
}