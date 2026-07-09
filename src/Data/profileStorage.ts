// ======================================================
// profileStorage.ts
// ------------------------------------------------------
// Central location for reading and writing the user's
// profile (name, titles, bio, photo), mirroring the
// pattern used by notificationSettings.ts -- storage keys,
// defaults, and getters live here so ProfilePage (and
// anything else that wants to display the profile) never
// touches localStorage keys directly.
// ======================================================

export const PROFILE_KEYS = {
    name:         "profile-name",
    primaryTitle: "profile-primary-title",
    titles:       "profile-titles",   // JSON-encoded string[]
    bio:          "profile-bio",
    photo:        "profile-photo",    // base64 data URL, "" = use default icon
} as const;

export const PROFILE_DEFAULTS = {
    name:         "",
    primaryTitle: "",
    titles:       "[]",
    bio:          "",
    photo:        "",
};

export interface ProfileData {
    name: string;
    primaryTitle: string;
    titles: string[];
    bio: string;
    photo: string;
}

{/* Reads the full profile from localStorage, falling back to defaults */}
export function getProfile(): ProfileData {
    let titles: string[] = [];
    try {
        titles = JSON.parse(localStorage.getItem(PROFILE_KEYS.titles) ?? PROFILE_DEFAULTS.titles);
        if (!Array.isArray(titles)) titles = [];
    } catch {
        titles = [];
    }

    return {
        name:         localStorage.getItem(PROFILE_KEYS.name) ?? PROFILE_DEFAULTS.name,
        primaryTitle: localStorage.getItem(PROFILE_KEYS.primaryTitle) ?? PROFILE_DEFAULTS.primaryTitle,
        titles,
        bio:          localStorage.getItem(PROFILE_KEYS.bio) ?? PROFILE_DEFAULTS.bio,
        photo:        localStorage.getItem(PROFILE_KEYS.photo) ?? PROFILE_DEFAULTS.photo,
    };
}

{/* Persists the full profile to localStorage and notifies listeners (e.g. Toolbar avatar) */}
export function saveProfile(profile: ProfileData): void {
    localStorage.setItem(PROFILE_KEYS.name, profile.name);
    localStorage.setItem(PROFILE_KEYS.primaryTitle, profile.primaryTitle);
    localStorage.setItem(PROFILE_KEYS.titles, JSON.stringify(profile.titles));
    localStorage.setItem(PROFILE_KEYS.bio, profile.bio);
    localStorage.setItem(PROFILE_KEYS.photo, profile.photo);
    window.dispatchEvent(new CustomEvent("profile-update"));
}
