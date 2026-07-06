// ======================================================
// JourneyFactory.ts
// ------------------------------------------------------
// Responsible for creating a Journey and automatically
// creating and linking its Notebook.
// ======================================================

import type { Journey } from "../types";
import type { Notebook } from "../../notes/types";
import { createNotebook } from "../../notes/utils/NotesFactory";

export function createJourney(): {
    journey: Journey;
    notebook: Notebook;
}
{
    const createdNotebook = createNotebook();

    const newJourney: Journey = {
        id: crypto.randomUUID(),

        notebookId: createdNotebook.id,

        name: "Untitled Journey",
        goal: "",
        mantra: "",
        currentFocus: "",

        preferredSessionLength: 60,
        plannedDays: [],

        createdDate: new Date().toISOString(),

        statistics: {
            totalHours: 0,
            totalSessions: 0,
            lastWorked: null,
        },
    };

   return {
    journey: newJourney,
    notebook: createdNotebook,
};
}