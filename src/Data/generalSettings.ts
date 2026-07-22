// ======================================================
// generalSettings.ts
// ------------------------------------------------------
// Central location for reading and writing General
// settings preferences, mirroring the pattern used by
// notificationSettings.ts -- storage keys, defaults, and
// getters live here so no component touches the
// localStorage key directly.
//
// Storage keys are unchanged from when this lived under
// "Notebook" settings, so existing users keep their saved
// preference (the setting now also covers task deletion,
// not just notebook/page/block deletion).
// ======================================================

export const GENERAL_SETTINGS_KEYS = {
    confirmBeforeDelete: "notebook-confirm-before-delete",
    smoothScroll: "general-smooth-scroll",
} as const;

export const GENERAL_SETTINGS_DEFAULTS = {
    // On by default — deleting a block, page, notebook, task, etc. asks first.
    confirmBeforeDelete: "true",
    // On by default — jumping to a section or opening an accordion/dropdown
    // animates instead of snapping instantly into place.
    smoothScroll: "true",
};

{/* Reads whether delete confirmations are enabled (defaults to on) */}
export function getConfirmBeforeDelete(): boolean {
    return (
        localStorage.getItem(GENERAL_SETTINGS_KEYS.confirmBeforeDelete) ??
        GENERAL_SETTINGS_DEFAULTS.confirmBeforeDelete
    ) === "true";
}

{/* Reads whether smooth scrolling/animated transitions are enabled (defaults to on) */}
export function getSmoothScroll(): boolean {
    return (
        localStorage.getItem(GENERAL_SETTINGS_KEYS.smoothScroll) ??
        GENERAL_SETTINGS_DEFAULTS.smoothScroll
    ) === "true";
}
