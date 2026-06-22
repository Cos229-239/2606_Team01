// ======================================================
// NotebookBrowser.tsx
// ------------------------------------------------------
// Displays the notebooks available to the user.
//
// This component is responsible only for rendering the
// notebook browser.

import type { Notebook, Page } from "../types";

interface NotebookBrowserProps
{
    notebooks: Notebook[];
    pages: Page[];
    selectedNotebookId: string | null;
    onCreateNotebook: () => void;
    onSelectedNotebook: (notebookId: string) => void;

    onCreatePage: (notebookId: string) => void;
    onSelectedPage: (pageId: string) => void;

}

export default function NotebookBrowser(
    {
        notebooks, onCreateNotebook,
        selectedNotebookId, onSelectedNotebook,
        pages, onCreatePage,
        onSelectedPage, }: NotebookBrowserProps)
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
                    {
                        const isSelected = notebook.id === selectedNotebookId;

                        const notebookPages = pages.filter(
                            (page) => page.notebookId === notebook.id
                        );

                        return (
                            <li key = { notebook.id }>
                            <div onClick = {() => onSelectedNotebook(notebook.id)
                            }
                            style = {{
                                cursor: "pointer",
                                fontWeight: isSelected ? "bold" : "normal",
                            }} >
                        
                         ▼ {notebook.title}
                         </div>
                         {isSelected && (
                                    <button
                                        onClick={() =>
                                            onCreatePage(notebook.id)
                                        }
                                    >
                                        + New Page
                                    </button>
                                )}
                                
                           {notebookPages.length > 0 && (
                                    <ul>
                                        {notebookPages.map((page) => (
                                            <li
                                                key={page.id}
                                                style={{
                                                    marginLeft: "1.5rem",
                                                    cursor: "default",
                                                }}
                                            >
                                                {page.title}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}