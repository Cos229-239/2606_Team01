// ======================================================
// NotebookBrowser.tsx
// ------------------------------------------------------
// Displays the notebooks available to the user.
//
// This component is responsible only for rendering the
// notebook browser.

import type { Notebook } from "../types";

interface NotebookBrowserProps
{
    notebooks: Notebook[];

    onCreateNotebook: () => void;

}

export default function NotebookBrowser(
    {
        notebooks, onCreateNotebook, }: NotebookBrowserProps)
{
    return (
        <section>
            <h1> Notebook </h1>

            <button onClick = { onCreateNotebook}> + New Notebook </button>

            {notebooks.length === 0 ? (
                <p> No Notebooks yet. </p>
            ): (
                <ul>
                    { notebooks.map((notebook) =>
                    ( <li key = {notebook.id} > 
                        {notebook.title} </li>
                    ))}
                </ul>
            )}
        </section>
    );
}