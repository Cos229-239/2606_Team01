// ======================================================
// notificationSound.ts
// ------------------------------------------------------
// Plain (non-hook) helpers for actually playing a
// notification sound. TimerPage calls playNotificationSound()
// directly when a countdown finishes -- it reads settings
// fresh from localStorage each time, so it always reflects
// whatever was last saved in Settings > Notifications,
// including from another window.
// ======================================================

import { playPreset } from "./soundPresets";
import { getNotificationSoundSettings } from "./notificationSettings";

{/* Plays the currently configured notification sound (preset or custom), respecting the enabled flag and volume. */}
export function playNotificationSound(): void {
    const settings = getNotificationSoundSettings();
    if (!settings.enabled) return;

    if (settings.useCustom && settings.customPath) {
        playCustomFile(settings.customPath, settings.volume);
        return;
    }

    try {
        playPreset(settings.preset, settings.volume);
    } catch (error) {
        console.error("[notificationSound] failed to play preset sound:", error);
    }
}

{/* Plays a user-chosen custom sound file. Goes through the Electron bridge (main process reads the file and hands back a data URL) since Chromium blocks renderer-side file:// access to arbitrary paths. Falls back to treating the path as a playable URL when the bridge isn't available (e.g. dev in a plain browser tab). */}
export function playCustomFile(filePath: string, volume: number): void {
    if (window.electron?.readAudioFileAsDataUrl) {
        window.electron.readAudioFileAsDataUrl(filePath)
            .then(dataUrl => {
                if (!dataUrl) {
                    console.warn("[notificationSound] could not read custom sound file:", filePath);
                    return;
                }
                const audio = new Audio(dataUrl);
                audio.volume = Math.max(0, Math.min(1, volume));
                audio.play().catch(error => console.error("[notificationSound] custom playback failed:", error));
            })
            .catch(error => console.error("[notificationSound] failed to read custom sound file:", error));
        return;
    }

    const audio = new Audio(filePath);
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.play().catch(error => console.error("[notificationSound] custom playback failed:", error));
}
