// ======================================================
// NotesPage.tsx
// ------------------------------------------------------
// Entry point for the Notes feature.
//
// Responsible for coordinating the Notes UI.


import { useEffect, useState } from "react";
import type { Notebook } from "../Features/notes/types";
import { loadNotebooks, saveNotebooks } from "../Features/notes/storage/notebookStorage";
import NotebookBrowser from "../Features/notes/browser/NotebookBrowser";
import { createNotebook } from "../Features/notes/utils/NotesFactory";

export default function NotesPage()
{
    const [notebooks, setNotebooks ] = useState <Notebook[]> ([]);

    useEffect(() =>
    {
        setNotebooks(loadNotebooks());
    }, []);

   

    function handleCreateNotebook()
    {
        const notebook = createNotebook();

        const updatedNotebooks = [ ...notebooks, notebook,];

        setNotebooks(updatedNotebooks);
        saveNotebooks(updatedNotebooks);
    }

    return(
        <NotebookBrowser notebooks = { notebooks } 
        onCreateNotebook = { handleCreateNotebook } />

    );

}