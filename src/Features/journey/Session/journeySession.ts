
{/* Nothing outside of this feature should be reading
         or writing LocalStorage directly for 
            sessions. */}

export type SessionMood =
    | "Focused"
    | "Planning"
    | "Recharge";


export type SessionStatus =
    | "Planning"
    | "Active"
    | "Completed";


export interface JourneySession
{
    sessionId: string;

    journeyId: string;

    pageId: string;
    status: SessionStatus;
    startedAt?: string;
    endedAt?: string;
    type: string;
    plannedDuration: number;
    mood: SessionMood;
    goal: string;

    actualDuration?: number;
}


const STORAGE_KEY = "journeySessions";

// ======================================================
// LOAD
// ======================================================

export function loadSessions(): JourneySession[]
{
    const stored =
        localStorage.getItem(STORAGE_KEY);

    if (!stored)
    {
        return [];
    }

    try
    {
        return JSON.parse(stored);
    }
    catch
    {
        return [];
    }
}

// ======================================================
// SAVE
// ======================================================

export function saveSessions(
    sessions: JourneySession[]
)
{
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(sessions)
    );
}

// ======================================================
// ADD
// ======================================================

export function addSession(
    session: JourneySession
)
{
    const updated =
    [
        ...loadSessions(),
        session,
    ];

    saveSessions(updated);

    return updated;
}

// ======================================================
// UPDATE
// ======================================================

export function updateSession(
    updatedSession: JourneySession
)
{
    const updated =
        loadSessions().map(
            (session) =>
                session.sessionId === updatedSession.sessionId
                    ? updatedSession
                    : session
        );

    saveSessions(updated);

    return updated;
}

// ======================================================
// DELETE
// ======================================================

export function deleteSession(
    sessionId: string
)
{
    const updated =
        loadSessions().filter(
            (session) =>
                session.sessionId !== sessionId
        );

    saveSessions(updated);

    return updated;
}

// ======================================================
// LOOKUPS
// ======================================================

export function getSessionById(
    sessionId: string
)
{
    return loadSessions().find(
        (session) =>
            session.sessionId === sessionId
    );
}

export function getSessionByPageId(
    pageId: string
)
{
    return loadSessions().find(
        (session) =>
            session.pageId === pageId
    );
}

export function getSessionsByJourneyId(
    journeyId: string
)
{
    return loadSessions().filter(
        (session) =>
            session.journeyId === journeyId
    );
}

// ======================================================
// SESSION LIFECYCLE
// ======================================================

export function startSession(
    sessionId: string
)
{
    const session =
        getSessionById(sessionId);

    if (!session)
    {
        return null;
    }

    const updatedSession: JourneySession =
    {
        ...session,
        status: "Active",
        startedAt: new Date().toISOString(),
    };

    updateSession(updatedSession);

    return updatedSession;
}

export function endSession(
    sessionId: string
)
{
    const session =
        getSessionById(sessionId);

    if (!session)
    {
        return null;
    }

    const updatedSession: JourneySession =
    {
        ...session,
        status: "Completed",
        endedAt: new Date().toISOString(),
    };

    updateSession(updatedSession);

    return updatedSession;
}

export function getActiveSessionForPage(
    pageId: string
)
{
    return getSessionByPageId(pageId) ?? null;
}