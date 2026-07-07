// ======================================================
// notificationSettings.ts
// ------------------------------------------------------
// Central location for reading and writing notification
// sound preferences, mirroring the pattern used by
// taskStorage.ts -- storage keys, defaults, and getters
// live here so NotificationsPage and TimerPage never touch
// localStorage keys directly.
// ======================================================

import type { NotificationSoundPreset } from "./soundPresets";

export const NOTIF_SOUND_KEYS = {
    enabled:    "notif-sound-enabled",
    preset:     "notif-sound-preset",
    volume:     "notif-sound-volume",
    useCustom:  "notif-sound-use-custom",
    customPath: "notif-sound-custom-path",
} as const;

export const NOTIF_SOUND_DEFAULTS = {
    enabled:    "true",
    preset:     "pulse" as NotificationSoundPreset,
    volume:     "0.6",
    useCustom:  "false",
    customPath: "",
};

// ── Timer completion behavior (flash + OS notification) ───────────────────
export const NOTIF_BEHAVIOR_KEYS = {
    flashEnabled:         "notif-flash-enabled",
    osNotificationEnabled: "notif-os-enabled",
} as const;

export const NOTIF_BEHAVIOR_DEFAULTS = {
    flashEnabled:          "true",
    osNotificationEnabled: "true",
};

export interface NotificationBehaviorSettings {
    flashEnabled: boolean;
    osNotificationEnabled: boolean;
}

{/* Reads the screen-flash and OS-notification toggles from localStorage */}
export function getNotificationBehaviorSettings(): NotificationBehaviorSettings {
    return {
        flashEnabled:          (localStorage.getItem(NOTIF_BEHAVIOR_KEYS.flashEnabled) ?? NOTIF_BEHAVIOR_DEFAULTS.flashEnabled) === "true",
        osNotificationEnabled: (localStorage.getItem(NOTIF_BEHAVIOR_KEYS.osNotificationEnabled) ?? NOTIF_BEHAVIOR_DEFAULTS.osNotificationEnabled) === "true",
    };
}

export interface NotificationSoundSettings {
    enabled: boolean;
    preset: NotificationSoundPreset;
    volume: number;
    useCustom: boolean;
    customPath: string;
}

{/* Reads the full set of notification sound settings from localStorage */}
export function getNotificationSoundSettings(): NotificationSoundSettings {
    return {
        enabled:    (localStorage.getItem(NOTIF_SOUND_KEYS.enabled) ?? NOTIF_SOUND_DEFAULTS.enabled) === "true",
        preset:     (localStorage.getItem(NOTIF_SOUND_KEYS.preset) as NotificationSoundPreset | null) ?? NOTIF_SOUND_DEFAULTS.preset,
        volume:     parseFloat(localStorage.getItem(NOTIF_SOUND_KEYS.volume) ?? NOTIF_SOUND_DEFAULTS.volume),
        useCustom:  (localStorage.getItem(NOTIF_SOUND_KEYS.useCustom) ?? NOTIF_SOUND_DEFAULTS.useCustom) === "true",
        customPath: localStorage.getItem(NOTIF_SOUND_KEYS.customPath) ?? NOTIF_SOUND_DEFAULTS.customPath,
    };
}
