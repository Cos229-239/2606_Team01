import type { Journey } from "../types";
import type { JourneySession } from "../Session/journeySession";
import { getSessionDuration } from "../Session/journeySession";


export interface JourneyStats
{
    sessionCount: number;
    completedCount: number;
    totalMinutes: number;
    createdDate: string;
    journeyLifetime: number;
}

// ======================================================
// COMPUTE STATS
// ======================================================
// Shared by JourneyOverview and JourneyPreview so both
// read from a single implementation instead of each
// recomputing the same numbers independently.

export function getJourneyStats(
    journey: Journey | null,
    sessions: JourneySession[]
): JourneyStats
{
    const sessionCount =
        sessions.length;

    const completedSessions =
        sessions.filter(
            (session) =>
                session.status === "Completed"
        );

    const completedCount =
        completedSessions.length;

    const totalMinutes =
        completedSessions.reduce(
            (totalSoFar, completedSession) =>
            {
                return (
                    totalSoFar +
                    getSessionDuration(completedSession)
                );
            },
            0
        );

    const createdDate =
        journey
            ? new Date(journey.createdAt).toLocaleDateString()
            : "-";

    const journeyLifetime =
        journey
            ? Math.floor(
                  (
                      Date.now() -
                      new Date(journey.createdAt).getTime()
                  ) /
                      (1000 * 60 * 60 * 24)
              )
            : 0;

    return {
        sessionCount,
        completedCount,
        totalMinutes,
        createdDate,
        journeyLifetime,
    };
}