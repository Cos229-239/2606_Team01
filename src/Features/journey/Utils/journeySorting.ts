import type { Journey } from "../types";
import type { Notebook } from "../../notes/types";

import { getSessionsByJourneyId } from "../Session/journeySession";
import { getMostRecentCompletedSessionForJourney } from "./journeyQueries";


export type SortDirection = "asc" | "desc";

{/* Ascending = oldest / least-recent / lowest-count first.
    Descending = newest / most-recent / highest-count first.
    Standard convention, consistent across every function here. */}

// ======================================================
// BY CREATED DATE
// ======================================================

export function sortJourneysByCreatedDate(
    journeys: Journey[],
    direction: SortDirection = "asc"
): Journey[]
{
    const sorted =
        [...journeys].sort(
            (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
        );

    return direction === "asc" ? sorted : sorted.reverse();
}

// ======================================================
// BY RECENT ACTIVITY
// ======================================================
// Journeys with no completed session have no activity date
// to sort by, so they always sort to the end, regardless
// of direction.

export function sortJourneysByRecentActivity(
    journeys: Journey[],
    direction: SortDirection = "asc"
): Journey[]
{
    const withActivity: { journey: Journey; date: number }[] = [];
    const withoutActivity: Journey[] = [];

    for (const journey of journeys)
    {
        const mostRecentSession =
            getMostRecentCompletedSessionForJourney(
                journey.journeyId
            );

        if (mostRecentSession?.endedAt)
        {
            withActivity.push({
                journey,
                date: new Date(mostRecentSession.endedAt).getTime(),
            });
        }
        else
        {
            withoutActivity.push(journey);
        }
    }

    const sortedWithActivity =
        withActivity
            .sort((a, b) => a.date - b.date)
            .map((entry) => entry.journey);

    const ordered =
        direction === "asc"
            ? sortedWithActivity
            : sortedWithActivity.reverse();

    return [...ordered, ...withoutActivity];
}

// ======================================================
// BY SESSION COUNT
// ======================================================

export function sortJourneysBySessionCount(
    journeys: Journey[],
    direction: SortDirection = "asc"
): Journey[]
{
    const sorted =
        [...journeys].sort(
            (a, b) =>
                getSessionsByJourneyId(a.journeyId).length -
                getSessionsByJourneyId(b.journeyId).length
        );

    return direction === "asc" ? sorted : sorted.reverse();
}

// ======================================================
// BY TITLE
// ======================================================
// Journey has no title of its own — title lives on the
// linked Notebook, so this is the one function here that
// needs a second collection passed in.

export function sortJourneysByTitle(
    journeys: Journey[],
    notebooks: Notebook[],
    direction: SortDirection = "asc"
): Journey[]
{
    function titleFor(journey: Journey): string
    {
        return (
            notebooks.find(
                (notebook) =>
                    notebook.id === journey.notebookId
            )?.title ?? "Untitled Journey"
        );
    }

    const sorted =
        [...journeys].sort(
            (a, b) =>
                titleFor(a).localeCompare(titleFor(b))
        );

    return direction === "asc" ? sorted : sorted.reverse();
}