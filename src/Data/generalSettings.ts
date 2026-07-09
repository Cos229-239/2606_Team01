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
} as const;

export const GENERAL_SETTINGS_DEFAULTS = {
    // On by default — deleting a block, page, notebook, task, etc. asks first.
    confirmBeforeDelete: "true",
};

{/* Reads whether delete confirmations are enabled (defaults to on) */}
export function getConfirmBeforeDelete(): boolean {
    return (
        localStorage.getItem(GENERAL_SETTINGS_KEYS.confirmBeforeDelete) ??
        GENERAL_SETTINGS_DEFAULTS.confirmBeforeDelete
    ) === "true";
}
