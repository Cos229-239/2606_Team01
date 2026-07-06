import type { Session } from "../types";

const STORAGE_KEY = "sessions";

// ======================================================
// Load Sessions
// ======================================================
export function loadSessions(): Session[]
{
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored)
    {
        return [];
    }

    return JSON.parse(stored);
}

// ======================================================
// Save Sessions
// ======================================================
export function saveSessions(sessions: Session[]): void
{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

// ======================================================
// Add Session
// ======================================================
export function addSession(session: Session): Session[]
{
    const existing = loadSessions();

    const updated = [...existing, session];

    saveSessions(updated);

    return updated;
}