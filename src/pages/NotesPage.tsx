import { useEffect, useState } from "react";
import type { Notebook, Page, Block } from "../Features/notes/types";
import {
    loadNotebooks,
    loadPages,
    saveNotebooks,
    savePages,
    loadBlocks,
    saveBlocks,
} from "../Features/notes/storage/notebookStorage";

import NotebookBrowser from "../Features/notes/browser/NotebookBrowser";
import { createNotebook, createPage } from "../Features/notes/utils/NotesFactory";

// ✅ ADD THIS IMPORT
import BlockList from "../Features/notes/editor/BlockList";

export default function NotesPage() {
    const [notebooks, setNotebooks] = useState<Notebook[]>([]);
    const [pages, setPages] = useState<Page[]>([]);
    const [blocks, setBlocks] = useState<Block[]>([]);

    const [selectedNotebookId, setSelectedNotebookId] =
        useState<string | null>(null);

    const [selectedPageId, setSelectedPageId] =
        useState<string | null>(null);

    useEffect(() => {
        setNotebooks(loadNotebooks());
        setPages(loadPages());
        setBlocks(loadBlocks());
    }, []);

    // ==================================================
    // Notebook Actions
    // ==================================================

    function handleCreateNotebook() {
        const notebook = createNotebook();

        const updatedNotebooks = [...notebooks, notebook];

        setNotebooks(updatedNotebooks);
        saveNotebooks(updatedNotebooks);

        setSelectedNotebookId(notebook.id);
        setSelectedPageId(null);
    }

    function handleSelectedNotebook(notebookId: string) {
        setSelectedNotebookId(notebookId);
        setSelectedPageId(null);
    }

    // ==================================================
    // Page Actions
    // ==================================================

    function handleCreatePage(notebookId: string) {
        const { page, block } = createPage(notebookId);

        const updatedPages = [...pages, page];
        setPages(updatedPages);
        savePages(updatedPages);

        const updatedBlocks = [...blocks, block];
        setBlocks(updatedBlocks);
        saveBlocks(updatedBlocks);

        const updatedNotebooks = notebooks.map((notebook) => {
            if (notebook.id !== notebookId) return notebook;

            return {
                ...notebook,
                pageIds: [...notebook.pageIds, page.id],
            };
        });

        setNotebooks(updatedNotebooks);
        saveNotebooks(updatedNotebooks);

        setSelectedPageId(page.id);
    }

    function handleSelectedPage(pageId: string) {
        setSelectedPageId(pageId);
    }

    function handlePageTitleChange(title: string) {
        if (!selectedPageId) return;

        const updatedPages = pages.map((page) => {
            if (page.id !== selectedPageId) return page;

            return {
                ...page,
                title,
            };
        });

        setPages(updatedPages);
        savePages(updatedPages);
    }

    const selectedPage = pages.find(
        (page) => page.id === selectedPageId
    );

    // ==================================================
    // BLOCK UPDATE (STEP 3 CORE)
    // ==================================================

    function handleUpdateBlock(blockId: string, content: string) {
        const updatedBlocks = blocks.map((block) => {
            if (block.id !== blockId) return block;

            if (block.type === "empty") {
                return {
                    ...block,
                    content,
                };
            }

            return block;
        });

        setBlocks(updatedBlocks);
        saveBlocks(updatedBlocks);
    }

    return (
        <div
            style={{
                display: "flex",
                height: "100vh",
                backgroundColor: "rgba(20, 12, 55, 0.38)",
            }}
        >
            {/* ==========================================
                Notebook Sidebar
            ========================================== */}
            <NotebookBrowser
                notebooks={notebooks}
                pages={pages}
                selectedNotebookId={selectedNotebookId}
                onCreateNotebook={handleCreateNotebook}
                onSelectedNotebook={handleSelectedNotebook}
                onCreatePage={handleCreatePage}
                onSelectedPage={handleSelectedPage}
            />

            {/* ==========================================
                Document Workspace
            ========================================== */}
            <main
                style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    padding: "40px",
                    overflowY: "auto",
                }}
            >
                {selectedPage ? (
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "900px",
                            backgroundColor: "rgba(20, 12, 55, 0.38)",
                            borderRadius: "10px",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                            padding: "48px",
                            minHeight: "900px",
                            boxSizing: "border-box",
                        }}
                    >
                        {/* Page Header */}
                        <input
                            type="text"
                            value={selectedPage.title}
                            onChange={(e) =>
                                handlePageTitleChange(e.target.value)
                            }
                            placeholder="Untitled Page"
                            style={{
                                width: "100%",
                                fontSize: "2.5rem",
                                fontWeight: "bold",
                                border: "none",
                                outline: "none",
                                background: "transparent",
                                marginBottom: "12px",
                            }}
                        />

                        {/* Metadata */}
                        <p
                            style={{
                                color: "#777",
                                fontSize: ".9rem",
                                marginBottom: "24px",
                            }}
                        >
                            Last edited: Just now
                        </p>

                        <hr
                            style={{
                                border: "none",
                                borderTop: "1px solid #e5e5e5",
                                marginBottom: "40px",
                            }}
                        />

                        {/* ======================================
                            DOCUMENT BODY (NOW LIVE EDITOR)
                        ====================================== */}
                        <div style={{ minHeight: "600px" }}>
                            <BlockList
                                page={selectedPage}
                                blocks={blocks}
                                onUpdateBlock={handleUpdateBlock}
                            />
                        </div>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            color: "#777",
                            fontSize: "1.2rem",
                        }}
                    >
                        Select or create a page to begin writing.
                    </div>
                )}
            </main>
        </div>
    );
}