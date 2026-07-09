// ======================================================
// notebookSettings.ts
// ------------------------------------------------------
// Central location for reading and writing Notebook
// feature preferences, mirroring the pattern used by
// notificationSettings.ts -- storage keys, defaults, and
// getters live here so no component touches the
// localStorage key directly.
// ======================================================

export const NOTEBOOK_SETTINGS_KEYS = {
    confirmBeforeDelete: "notebook-confirm-before-delete",
} as const;

export const NOTEBOOK_SETTINGS_DEFAULTS = {
    // On by default — deleting a block, page, notebook, etc. asks first.
    confirmBeforeDelete: "true",
};

{/* Reads whether delete confirmations are enabled (defaults to on) */}
export function getConfirmBeforeDelete(): boolean {
    return (
        localStorage.getItem(NOTEBOOK_SETTINGS_KEYS.confirmBeforeDelete) ??
        NOTEBOOK_SETTINGS_DEFAULTS.confirmBeforeDelete
    ) === "true";
}
