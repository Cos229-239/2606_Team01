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

interface NotebookBrowserProps
{
    notebooks: Notebook[];
    folders: NotebookFolder[];
    pages: Page[];

    selectedFolderId: string | null;
    selectedNotebookId: string | null;

    onCreateNotebook: () => void;
    onSelectedNotebook: (notebookId: string) => void; onDeleteNotebook: ( notebookId: string ) => void;
    onRenameNotebook: (  notebookId: string, 
                title: string ) => void;

    onCreatePage: (notebookId: string) => void;
    onSelectedPage: (pageId: string) => void;
    onDeletePage: (  pageId: string ) => void;

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

    onCreatePage,
    onSelectedPage,
    onDeletePage,
    onDeleteNotebook,
    onRenameNotebook,
    
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

const folderNotebooks =
            notebooks.filter(
                (notebook) =>
                    notebook.folderId === selectedFolderId
            );


const displayedNotebooks =
                selectedFolderId === null
                    ? looseNotebooks
                    : folderNotebooks;
               
function startEditingFolder(folder: NotebookFolder)
{
    setEditingFolderId(folder.id);
    setEditingFolderTitle(folder.title);
}
  function commitFolderRename()
    {
        if (!editingFolderId) return;
        onRenameFolder(editingFolderId, editingFolderTitle.trim() || "Untitled Folder");
        setEditingFolderId(null);
    }

    // CHANGED: assigns a loose notebook to the currently open folder,
    // then closes the picker.
    function handleAddExistingNotebook(notebookId: string)
    {
        if (!selectedFolderId) return;

        onAssignNotebookToFolder(notebookId, selectedFolderId);
        setShowAddExistingPopup(false);
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
            {/* ================= Back + Rename ================= */}

            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "20px",
                    marginBottom: "10px",
                }}
            >
                <button onClick={() => onSelectedFolder(null)}>
                    ← Back
                </button>

                <button
                    onClick={() =>
                        selectedFolder && startEditingFolder(selectedFolder)
                    }
                >
                    Rename
                </button>
            </div>

            {/* ================= Toolbar ================= */}

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "20px",
                }}
            >
                <button
                    onClick={onCreateFolder}
                    style={{
                        padding: "10px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    + New Folder
                </button>

                <button
                    onClick={onCreateNotebook}
                    style={{
                        padding: "10px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    + New Notebook
                </button>

                {selectedFolderId !== null && (
                    <button
                        onClick={() => setShowAddExistingPopup(true)}
                        style={{
                            padding: "10px",
                            borderRadius: "6px",
                            cursor: "pointer",
                        }}
                    >
                        + Add Existing Notebook
                    </button>
                )}
            </div>

            {/* ================= Current Folder Title ================= */}

            {selectedFolderId !== null && (
                <div
                    onDoubleClick={() =>
                        selectedFolder && startEditingFolder(selectedFolder)
                    }
                    style={{
                        marginBottom: "20px",
                        fontWeight: "bold",
                    }}
                >
                    {editingFolderId === selectedFolder?.id ? (
                        <input
                            autoFocus
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
                                border: "none",
                                outline: "none",
                                background: "transparent",
                                color: "inherit",
                                font: "inherit",
                                fontWeight: "bold",
                            }}
                        />
                    ) : (
                        <>📁 {selectedFolder?.title}</>
                    )}
                </div>
            )}

            {/* ================= Add Existing Notebook popup ================= */}

            {showAddExistingPopup && (
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        background: "#1a1a2e",
                        borderRadius: 8,
                        padding: 12,
                        marginBottom: "20px",
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
                                handleAddExistingNotebook(notebook.id)
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

                    <button onClick={() => setShowAddExistingPopup(false)}>
                        Close
                    </button>
                </div>
            )}

            {/* ================= Folder List ================= */}

            {selectedFolderId === null &&
                folders.map((folder) => (
                    <div
                        key={folder.id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "8px",
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
                    </div>
                ))}

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

            {displayedNotebooks.map((notebook) => {
                const isSelected =
                    selectedNotebookId === notebook.id;

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
                                onDoubleClick={() => {
                                    setEditingNotebookId(notebook.id);
                                    setEditingTitle(notebook.title);
                                }}
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
                                {editingNotebookId === notebook.id ? (
                                    <input
                                        autoFocus
                                        onClick={(e) => e.stopPropagation()}
                                        value={editingTitle}
                                        onChange={(e) =>
                                            setEditingTitle(e.target.value)
                                        }
                                        onBlur={() => {
                                            onRenameNotebook(
                                                notebook.id,
                                                editingTitle.trim() ||
                                                    "Untitled Notebook"
                                            );
                                            setEditingNotebookId(null);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter")
                                            {
                                                onRenameNotebook(
                                                    notebook.id,
                                                    editingTitle.trim() ||
                                                        "Untitled Notebook"
                                                );
                                                setEditingNotebookId(null);
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
                                            </div>
                                        ))}
                                    </div>
                                )}

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
                            </>
                        )}
                    </div>
                );
            })}
        </aside>
        </>
    );
}