// ======================================================
// NotebookBrowser.tsx
// ------------------------------------------------------
// Displays the notebooks available to the user.
//
// Responsible only for rendering the notebook browser
// and notifying the parent component about user actions.
// ======================================================

import type { NotebookFolder, Notebook, Page } from "../types";
import { useState } from "react";
import { useConfirmDelete } from "../../../Components/ConfirmDialog";
import Tooltip from "../../../Components/Tooltip";

interface NotebookBrowserProps
{
    notebooks: Notebook[];
    folders: NotebookFolder[];
    pages: Page[];

    selectedFolderId: string | null;
    selectedNotebookId: string | null;
    selectedPageId: string | null;

    onCreateNotebook: () => void;
    onSelectedNotebook: (notebookId: string) => void; 
    onDeleteNotebook: ( notebookId: string ) => void;
    onRenameNotebook: (  notebookId: string, title: string ) => void;

    onCreatePage: (notebookId: string) => void;
    onSelectedPage: (pageId: string) => void;
    onDeletePage: (  pageId: string ) => void;
    onRenamePage: (pageId: string, title: string) => void;

    onCreateFolder: () => void;
    onDeleteFolder: (folderId: string) => void;
    onSelectedFolder: (folderId: string | null) => void;
    onRenameFolder: (folderId: string, title: string) => void;
    onAssignNotebookToFolder: (notebookId: string, folderId: string) => void;
    onRemoveNotebookFromFolder: (notebookId: string) => void;
}



export default function NotebookBrowser(
{
    notebooks,
    pages,
    folders,


    selectedNotebookId,
    onCreateNotebook,
    onSelectedNotebook,
    onDeleteNotebook,
    onRenameNotebook,


    selectedPageId,
    onCreatePage,
    onSelectedPage,
    onDeletePage,
    onRenamePage,
    
    onCreateFolder,
    onDeleteFolder,
    selectedFolderId,
    onSelectedFolder,
    onRenameFolder,
    onAssignNotebookToFolder,
    onRemoveNotebookFromFolder
    
}: NotebookBrowserProps)

{
const [editingFolderId, setEditingFolderId] =
    useState<string | null>(null);

const [editingFolderTitle, setEditingFolderTitle] =
    useState("");

const [editingNotebookId, setEditingNotebookId] =
    useState<string | null>(null);

const [editingPageId, setEditingPageId] =
        useState<string | null>(null);

const [editingPageTitle, setEditingPageTitle] =
        useState("");

const [editingTitle, setEditingTitle] =
    useState("");


const [showAddExistingPopup, setShowAddExistingPopup] = useState(false);

const { requestDelete, confirmDialog } = useConfirmDelete();

const looseNotebooks = notebooks.filter(
                    (notebook) => !notebook.folderId
                );

const selectedFolder =
            folders.find(
                (folder) =>
                    folder.id === selectedFolderId
            );


    function startEditingFolder(folder: NotebookFolder)
    {
        setEditingFolderId(folder.id);
        setEditingFolderTitle(folder.title);
    }

    function commitFolderRename()
    {
        if (!editingFolderId) return;

        onRenameFolder(
            editingFolderId,
            editingFolderTitle.trim() || "Untitled Folder"
        );

        setEditingFolderId(null);
    }

function startEditingNotebook(notebook: Notebook)
    {
        setEditingNotebookId(notebook.id);
        setEditingTitle(notebook.title);
    }

    function commitNotebookRename(notebookId: string)
    {
        onRenameNotebook(
            notebookId,
            editingTitle.trim() || "Untitled Notebook"
        );

        setEditingNotebookId(null);
    }

    // CHANGED: new — same pattern as folder/notebook rename.
    function startEditingPage(page: Page)
    {
        setEditingPageId(page.id);
        setEditingPageTitle(page.title);
    }

    function commitPageRename()
    {
        if (!editingPageId) return;

        onRenamePage(
            editingPageId,
            editingPageTitle.trim() || "Untitled Page"
        );

        setEditingPageId(null);
    }

    function handleRenameButtonClick()
    {
        if (selectedPageId)
        {
            const page = pages.find((p) => p.id === selectedPageId);

            if (page)
            {
                startEditingPage(page);
                return;
            }
        }

        if (selectedNotebookId)
        {
            const notebook = notebooks.find(
                (n) => n.id === selectedNotebookId
            );

            if (notebook)
            {
                startEditingNotebook(notebook);
                return;
            }
        }

        if (selectedFolder)
        {
            startEditingFolder(selectedFolder);
        }
    }


    // CHANGED: assigns a loose notebook to the currently open folder,
    // then closes the picker.
    function handleAddExistingNotebook(notebookId: string)
    {
        if (!selectedFolderId) return;

        onAssignNotebookToFolder(notebookId, selectedFolderId);
        setShowAddExistingPopup(false);
    }
    function renderNotebookRow(notebook: Notebook)
    {
        const isSelected = selectedNotebookId === notebook.id;

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
                        onClick={() => onSelectedNotebook(notebook.id)}
                        onDoubleClick={() => startEditingNotebook(notebook)}
                        style={{
                            flex: 1,
                            textAlign: "left",
                            cursor: "pointer",
                            padding: "8px 10px",
                            borderRadius: "6px",
                            fontWeight: isSelected ? "bold" : "normal",
                            backgroundColor: isSelected
                                ? "rgba(20, 12, 55, 0.38)"
                                : "transparent",
                        }}
                    >
                        {editingNotebookId === notebook.id ? (
                            <input
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                                value={editingTitle}
                                onChange={(e) =>
                                    setEditingTitle(e.target.value)
                                }
                                onBlur={() => commitNotebookRename(notebook.id)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter")
                                    {
                                        commitNotebookRename(notebook.id);
                                    }
                                }}
                                style={{
                                    width: "100%",
                                    border: "none",
                                    outline: "none",
                                    background: "transparent",
                                    color: "inherit",
                                    font: "inherit",
                                }}
                            />
                        ) : (
                            notebook.title
                        )}
                    </button>

                    {notebook.folderId && (
                        <button
                            onClick={() =>
                                onRemoveNotebookFromFolder(notebook.id)
                            }
                            style={{
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                opacity: 0.6,
                                fontSize: "0.8rem",
                            }}
                            title="Remove from folder"
                        >
                            ↩ Remove
                        </button>
                    )}

                    <Tooltip text="Delete this notebook and everything in it">
                        <button
                            onClick={() =>
                                requestDelete(
                                    `Delete "${notebook.title || "Untitled Notebook"}" and all of its pages? This can't be undone.`,
                                    () => onDeleteNotebook(notebook.id)
                                )
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
                    </Tooltip>
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
                                {notebookPages.map((page) => {
                                    const isPageSelected =
                                        selectedPageId === page.id;

                                    return (
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
                                                onDoubleClick={() =>
                                                    startEditingPage(page)
                                                }
                                                style={{
                                                    flex: 1,
                                                    textAlign: "left",
                                                    cursor: "pointer",
                                                    padding: "6px 8px",
                                                    borderRadius: "4px",
                                                    fontWeight: isPageSelected
                                                        ? "bold"
                                                        : "normal",
                                                }}
                                            >
                                                {editingPageId === page.id ? (
                                                    <input
                                                        autoFocus
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                        value={editingPageTitle}
                                                        onChange={(e) =>
                                                            setEditingPageTitle(
                                                                e.target.value
                                                            )
                                                        }
                                                        onBlur={commitPageRename}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter")
                                                            {
                                                                commitPageRename();
                                                            }
                                                        }}
                                                        style={{
                                                            width: "100%",
                                                            border: "none",
                                                            outline: "none",
                                                            background:
                                                                "transparent",
                                                            color: "inherit",
                                                            font: "inherit",
                                                        }}
                                                    />
                                                ) : (
                                                    page.title
                                                )}
                                            </button>

                                            <Tooltip text="Delete this page">
                                                <button
                                                    onClick={() =>
                                                        requestDelete(
                                                            `Delete "${page.title || "Untitled Page"}"? This can't be undone.`,
                                                            () => onDeletePage(page.id)
                                                        )
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
                                            </Tooltip>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <Tooltip text="Add a blank page to this notebook">
                            <button
                                onClick={() => onCreatePage(notebook.id)}
                                style={{
                                    marginTop: "10px",
                                    marginLeft: "10px",
                                    padding: "6px 10px",
                                    cursor: "pointer",
                                }}
                            >
                                + New Page
                            </button>
                        </Tooltip>
                    </>
                )}
            </div>
        );
    }


    return (
        <>
        {confirmDialog}
        <aside
            style={{
                width: "260px",
                flexShrink: 0,
                padding: "12px",
                borderRight: "1px solid rgba(255,255,255,0.1)",
                height: "100%",
                minHeight: 0,
                overflowY: "auto",
            }}
        >
            
            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "20px",
                    marginBottom: "20px",
                    flexWrap: 'wrap'
                }}
            >
                <Tooltip text="Group notebooks together under a folder">
                    <button
                        onClick={onCreateFolder}
                        style={{
                            padding: "10px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            flex: 1,
                            width: '50%'
                        }}
                    >
                        + New Folder
                    </button>
                </Tooltip>

                <Tooltip text="Start a new notebook for a separate set of pages">
                    <button
                        onClick={onCreateNotebook}
                        style={{
                            padding: "10px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            flex: 1,
                            width: '50%'
                        }}
                    >
                        + New Notebook
                    </button>
                </Tooltip>

                <Tooltip text="Rename whatever's currently selected on the left">
                    <button
                        onClick={handleRenameButtonClick}
                        style={{
                            padding: "10px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            width: '100%'
                        }}
                    >
                        Rename
                    </button>
                </Tooltip>
            </div>

            {folders.length === 0 && notebooks.length === 0 && (
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

            {/* ================= Folders ================= */}
            {/* CHANGED: folders always show at root now, and expand in
                place — same interaction model as a notebook expanding
                to show its pages. */}

            {folders.map((folder) => {
                const isFolderSelected = selectedFolderId === folder.id;

                const notebooksInFolder = notebooks.filter(
                    (notebook) => notebook.folderId === folder.id
                );

                return (
                    <div
                        key={folder.id}
                        style={{ marginBottom: "18px" }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "8px",
                            }}
                        >
                            <button
                                onClick={() => onSelectedFolder(folder.id)}
                                onDoubleClick={() => startEditingFolder(folder)}
                                style={{
                                    flex: 1,
                                    textAlign: "left",
                                    padding: "8px 10px",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontWeight: isFolderSelected
                                        ? "bold"
                                        : "normal",
                                    backgroundColor: isFolderSelected
                                        ? "rgba(20, 12, 55, 0.38)"
                                        : "transparent",
                                }}
                            >
                                {editingFolderId === folder.id ? (
                                    <input
                                        autoFocus
                                        onClick={(e) => e.stopPropagation()}
                                        value={editingFolderTitle}
                                        onChange={(e) =>
                                            setEditingFolderTitle(e.target.value)
                                        }
                                        onBlur={commitFolderRename}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter")
                                            {
                                                commitFolderRename();
                                            }
                                        }}
                                        style={{
                                            width: "100%",
                                            border: "none",
                                            outline: "none",
                                            background: "transparent",
                                            color: "inherit",
                                            font: "inherit",
                                        }}
                                    />
                                ) : (
                                    <>📁 {folder.title}</>
                                )}
                            </button>

                            <Tooltip text="Delete this folder (notebooks inside stay, just unfiled)">
                                <button
                                    onClick={() =>
                                        requestDelete(
                                            `Delete "${folder.title || "Untitled Folder"}"? Notebooks inside it will become loose, not deleted.`,
                                            () => onDeleteFolder(folder.id)
                                        )
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
                            </Tooltip>
                        </div>

                        {/* ================= Folder Contents ================= */}
                        {isFolderSelected && (
                            <div
                                style={{
                                    marginTop: "12px",
                                    marginLeft: "18px",
                                }}
                            >
                                <Tooltip text="Move one of your unfiled notebooks into this folder">
                                    <button
                                        onClick={() => setShowAddExistingPopup(true)}
                                        style={{
                                            marginBottom: "12px",
                                            padding: "6px 10px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        + Add Existing Notebook
                                    </button>
                                </Tooltip>

                                {showAddExistingPopup && (
                                    <div
                                        style={{
                                            position: "relative",
                                            width: "100%",
                                            background: "#1a1a2e",
                                            borderRadius: 8,
                                            padding: 12,
                                            marginBottom: "12px",
                                            zIndex: 1000,
                                        }}
                                    >
                                        <h4>Add Existing Notebook</h4>

                                        {looseNotebooks.length === 0 && (
                                            <div
                                                style={{
                                                    opacity: 0.6,
                                                    fontSize: "0.85rem",
                                                    padding: "8px 0",
                                                }}
                                            >
                                                No loose notebooks to add.
                                            </div>
                                        )}

                                        {looseNotebooks.map((notebook) => (
                                            <div
                                                key={notebook.id}
                                                onClick={() =>
                                                    handleAddExistingNotebook(
                                                        notebook.id
                                                    )
                                                }
                                                style={{
                                                    padding: "10px",
                                                    cursor: "pointer",
                                                    borderBottom:
                                                        "1px solid rgba(255,255,255,.15)",
                                                }}
                                            >
                                                {notebook.title}
                                            </div>
                                        ))}

                                        <button
                                            onClick={() =>
                                                setShowAddExistingPopup(false)
                                            }
                                        >
                                            Close
                                        </button>
                                    </div>
                                )}

                                {notebooksInFolder.length === 0 && (
                                    <div
                                        style={{
                                            opacity: 0.6,
                                            fontSize: "0.85rem",
                                        }}
                                    >
                                        No notebooks in this folder yet.
                                    </div>
                                )}

                                {notebooksInFolder.map((notebook) =>
                                    renderNotebookRow(notebook)
                                )}
                            </div>
                        )}
                    </div>
                );
            })}

            {/* ================= Loose Notebooks ================= */}
            {/* Always shown at root, same as before. */}

            {looseNotebooks.map((notebook) => renderNotebookRow(notebook))}
        </aside>
        </>
    );
}