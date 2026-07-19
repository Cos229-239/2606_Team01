import type { Journey } from "../types";
import type { Page } from "../../notes/types";

import
{
    type JourneySession,
    getSessionsByJourneyId,
}
from "../Session/journeySession";


{/* This file answers questions about Journey data.
    It does not render UI, calculate statistics, or sort
    collections — see journeyStats.ts and journeySorting.ts
    for those. */}

// ======================================================
// MOST RECENT COMPLETED SESSION
// ======================================================

export function getMostRecentCompletedSession(
    sessions: JourneySession[]
): JourneySession | null
{
    const completedSessions =
        sessions.filter(
            (session) =>
                session.status === "Completed" &&
                session.endedAt
        );

    if (completedSessions.length === 0)
    {
        return null;
    }

    const sorted =
        [...completedSessions].sort(
            (a, b) =>
                new Date(b.endedAt as string).getTime() -
                new Date(a.endedAt as string).getTime()
        );

    return sorted[0];
}

export function getMostRecentCompletedSessionForJourney(
    journeyId: string
): JourneySession | null
{
    const sessions =
        getSessionsByJourneyId(journeyId);

    return getMostRecentCompletedSession(sessions);
}

// ======================================================
// MOST RECENT JOURNEY
// ======================================================
// Picks the journey whose most recently completed session
// is closest to now. If no journey has any completed
// session, falls back to the most recently created journey.
// Returns null only when there are no journeys at all.

export function getMostRecentJourney(
    journeys: Journey[]
): Journey | null
{
    if (journeys.length === 0)
    {
        return null;
    }

    let bestJourney: Journey | null = null;
    let bestSessionDate: number | null = null;

    for (const journey of journeys)
    {
        const mostRecentSession =
            getMostRecentCompletedSessionForJourney(
                journey.journeyId
            );

        if (!mostRecentSession?.endedAt)
        {
            continue;
        }

        const sessionDate =
            new Date(mostRecentSession.endedAt).getTime();

        if (
            bestSessionDate === null ||
            sessionDate > bestSessionDate
        )
        {
            bestJourney = journey;
            bestSessionDate = sessionDate;
        }
    }

    if (bestJourney)
    {
        return bestJourney;
    }

    // Fallback — nobody has a completed session yet.
    // Just get them into a journey: most recently created wins.
    const sortedByCreated =
        [...journeys].sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );

    return sortedByCreated[0];
}

// ======================================================
// OWNERSHIP LOOKUPS
// ======================================================

export function getJourneyForNotebook(
    notebookId: string,
    journeys: Journey[]
): Journey | null
{
    return journeys.find(
        (journey) =>
            journey.notebookId === notebookId
    ) ?? null;
}

export function getJourneyForPage(
    pageId: string,
    journeys: Journey[],
    pages: Page[]
): Journey | null
{
    const page =
        pages.find(
            (page) =>
                page.id === pageId
        );

    if (!page)
    {
        return null;
    }

    return getJourneyForNotebook(page.notebookId, journeys);
}