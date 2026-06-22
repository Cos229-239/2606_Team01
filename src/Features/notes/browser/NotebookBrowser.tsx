// ======================================================
// NotebookBrowser.tsx
// ------------------------------------------------------
// Displays the notebooks available to the user.
//
// Responsible only for rendering the notebook browser
// and notifying the parent component about user actions.
// ======================================================

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
    notebooks,
    pages,
    selectedNotebookId,

    onCreateNotebook,
    onSelectedNotebook,

    onCreatePage,
    onSelectedPage,
}: NotebookBrowserProps)
{
    return (
        <aside
            style={{
                width: "260px",
                minWidth: "260px",
                height: "100vh",

                display: "flex",
                flexDirection: "column",

                padding: "20px",

                borderRight: "1px solid #d8d8d8",
                backgroundColor: "rgba(20, 12, 55, 0.38)",

                boxSizing: "border-box",

                overflowY: "auto",
            }}
        >
            {/* ==========================================
                Sidebar Header
            ========================================== */}

            <h1
                style={{
                    marginTop: 0,
                    marginBottom: "20px",
                    fontSize: "1.5rem",
                }}
            >
                Notebook
            </h1>

            {/* ==========================================
                New Notebook Button
            ========================================== */}

            <button
                onClick={onCreateNotebook}
                style={{
                    marginBottom: "24px",
                    padding: "10px",
                    cursor: "pointer",
                }}
            >
                + New Notebook
            </button>

            {/* ==========================================
                Empty State
            ========================================== */}

            {notebooks.length === 0 && (
                <p>No notebooks yet.</p>
            )}

            {/* ==========================================
                Notebook List
            ========================================== */}

            {notebooks.map((notebook) =>
            {
                const isSelected =
                    notebook.id === selectedNotebookId;

                const notebookPages = pages.filter(
                    (page) => page.notebookId === notebook.id
                );

                return (
                    <div
                        key={notebook.id}
                        style={{
                            marginBottom: "18px",
                        }}
                    >
                        {/* ==============================
                            Notebook Row
                        ============================== */}

                        <div
                            onClick={() =>
                                onSelectedNotebook(notebook.id)
                            }
                            style={{
                                cursor: "pointer",

                                padding: "8px 10px",

                                borderRadius: "6px",

                                fontWeight:
                                    isSelected
                                        ? "bold"
                                        : "normal",

                                backgroundColor: 
                                    isSelected ? "rgba(20, 12, 55, 0.38)" 
                                                : "transparent",

                            }}
                        >
                            📒 {notebook.title}
                        </div>

                        {/* ==============================
                            Notebook Actions
                        ============================== */}

                        {isSelected && (
                            <button
                                onClick={() =>
                                    onCreatePage(notebook.id)
                                }
                                style={{
                                    marginTop: "10px",
                                    marginLeft: "10px",
                                    padding: "6px 10px",
                                    cursor: "pointer",
                                }}
                            >
                                + New Page
                            </button>
                        )}

                        {/* ==============================
                            Pages
                        ============================== */}

                        {notebookPages.length > 0 && (
                            <div
                                style={{
                                    marginTop: "12px",
                                    marginLeft: "18px",

                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "6px",
                                }}
                            >
                                {notebookPages.map((page) => (
                                    <div
                                        key={page.id}
                                        onClick={() =>
                                            onSelectedPage(page.id)
                                        }
                                        style={{
                                            cursor: "pointer",

                                            padding: "6px 8px",

                                            borderRadius: "4px",

                                            userSelect: "none",
                                        }}
                                    >
                                        📄 {page.title}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </aside>
    );
}