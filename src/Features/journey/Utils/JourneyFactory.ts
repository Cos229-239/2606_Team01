import type { Journey } from "../types";
import { createNotebook } from "../../notes/utils/NotesFactory";


export function createJourney()
{
    const notebook =
        createNotebook("New Journey");


    const journey: Journey =
    {
        journeyId: crypto.randomUUID(),

        notebookId: notebook.id,
    };


    return {
        journey,
        notebook,
    };
}