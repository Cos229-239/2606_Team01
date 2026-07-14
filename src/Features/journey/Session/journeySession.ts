
{/* Nothing outside of this feature should be reading
         or writing LocalStorage directly for 
            sessions. */}


import
{
    loadSessions,
    updateSession,
}
from "../Storage/sessionStorage";


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
    createdAt: string;
    startedAt?: string;
    endedAt?: string;

    type: string;
    plannedDuration: number;
    mood: SessionMood;
    goal: string;

    
    actualDuration?: number;
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

export function getSessionDuration(
    session: JourneySession
)
{
    if(
        !session.startedAt ||
        !session.endedAt
    )
    {
        return 0;
    }


    const start =
        new Date(
            session.startedAt
        ).getTime();


    const end =
        new Date(
            session.endedAt
        ).getTime();


    const difference =
        end - start;


    return Math.floor(
        difference / 1000 / 60
    );
}