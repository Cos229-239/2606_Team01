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
    onDeletePage: (  pageId: string ) => void;
    onDeleteNotebook: ( notebookId: string ) => void;
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
    onDeletePage,
    onDeleteNotebook,
}: NotebookBrowserProps)
{
     return (
        <aside
            style={{
                width: "260px",
                padding: "12px",
                borderRight: "1px solid rgba(255,255,255,0.1)",
            }}
        >
        {/* ================= New Notebook ================= */}
            <button
                onClick={onCreateNotebook}
                style={{
                    marginBottom: "16px",
                    padding: "10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                }}
            >
                + New Notebook
            </button>

         {notebooks.length === 0 && (

                            <div
                                style={{
                                    marginTop: "20px",
                                    opacity: 0.7,
                                    fontSize: "0.9rem",
                                }}
                            >
                                No notebooks yet. Create your first notebook.
                            </div>
             )}

            {/* ================= Notebook List ================= */}
            {notebooks.map((notebook) => {
                const isSelected =
                    selectedNotebookId === notebook.id;

                //  derive pages correctly
                const notebookPages = pages.filter(
                    (page) => page.notebookId === notebook.id
                );

                return (
                    <div
                        key={notebook.id}
                        style={{ marginBottom: "18px" }}
                    >
                        {/* ================= Notebook Row ================= */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "8px",
                            }}
                        >
                            <button
                                onClick={() =>
                                    onSelectedNotebook(notebook.id)
                                }
                                style={{
                                    flex: 1,
                                    textAlign: "left",
                                    cursor: "pointer",
                                    padding: "8px 10px",
                                    borderRadius: "6px",
                                    fontWeight: isSelected
                                        ? "bold"
                                        : "normal",
                                    backgroundColor: isSelected
                                        ? "rgba(20, 12, 55, 0.38)"
                                        : "transparent",
                                }}
                            >
                                {notebook.title}
                            </button>

                            <button
                                onClick={() =>
                                    onDeleteNotebook(notebook.id)
                                }
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    cursor: "pointer",
                                    opacity: 0.5,
                                }}
                            >
                                X
                            </button>
                        </div>

                        {/* ================= Pages ================= */}
                        {isSelected && (
                            <>

                            
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
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                }}
                                            >
                                                <button
                                                    onClick={() =>
                                                        onSelectedPage(page.id)
                                                    }
                                                    style={{
                                                        flex: 1,
                                                        textAlign: "left",
                                                        cursor: "pointer",
                                                        padding: "6px 8px",
                                                        borderRadius: "4px",
                                                    }}
                                                >
                                                    {page.title}
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        onDeletePage(page.id)
                                                    }
                                                    style={{
                                                        border: "none",
                                                        background:
                                                            "transparent",
                                                        cursor: "pointer",
                                                        opacity: 0.5,
                                                    }}
                                                >
                                                    X
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

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
                            </>
                        )}
                    </div>
                );
            })}
        </aside>
    );
}