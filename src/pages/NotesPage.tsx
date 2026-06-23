import { useEffect, useState } from "react";
import type { Notebook, Page, Block } from "../Features/notes/types";

import {   loadNotebooks, loadPages,  saveNotebooks,
              savePages,   loadBlocks,    saveBlocks,
        } from "../Features/notes/storage/notebookStorage";

import NotebookBrowser from "../Features/notes/browser/NotebookBrowser";import
 {
    createNotebook,  createPage, createEmptyBlock,
} from "../Features/notes/utils/NotesFactory";
import BlockList from "../Features/notes/editor/BlockList";

export default function NotesPage() {
    const [notebooks, setNotebooks] = useState<Notebook[]>([]);
    const [pages, setPages] = useState<Page[]>([]);
    const [blocks, setBlocks] = useState<Block[]>([]);

    const [selectedNotebookId, setSelectedNotebookId] =
        useState<string | null>(null);

    const [selectedPageId, setSelectedPageId] =
        useState<string | null>(null);

    const [focusedBlockId, setFocusedBlockId] =
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


    // ==================================================
// Create Block After
// ==================================================
function handleCreateBlockAfter(
    blockId: string
)
{
    if (!selectedPage)
    {
        return;
    }

    const newBlock = createEmptyBlock(selectedPage.id);
    

    const updatedBlocks = [
        ...blocks,
        newBlock, 
    ];

    setBlocks(updatedBlocks);
    saveBlocks(updatedBlocks);

    const updatedPages =
                    pages.map((page) =>
        {
            if (
                page.id !== selectedPage.id
            )
            {
                return page;
            }

            const index =
                page.blockIds.indexOf(blockId);

            const newBlockIds = [  ...page.blockIds,    ];

            newBlockIds.splice(
                index + 1,  0,   newBlock.id
            );

            return {
                ...page,
                blockIds: newBlockIds,
            };
        });

    setPages(updatedPages);
    savePages(updatedPages);
    setFocusedBlockId(newBlock.id);
}



    function handleDeleteBlock(
    blockId: string
)
{
    if (!selectedPage)
    {
        return;
    }

    const page =
        pages.find(
            (page) =>
                page.id === selectedPage.id
        );

    if (!page)
    {
        return;
    }

    // never allow 0 blocks

    if (
        page.blockIds.length <= 1
    )
    {
        return;
    }

    const deletedIndex =
        page.blockIds.indexOf(
            blockId
        );

    const previousBlockId =
        page.blockIds[
            deletedIndex - 1
        ] ?? null;

    const updatedBlocks =
        blocks.filter(
            (block) =>
                block.id !== blockId
        );

    setBlocks(updatedBlocks);
    saveBlocks(updatedBlocks);

    const updatedPages =
        pages.map((page) =>
        {
            if (
                page.id !== selectedPage.id
            )
            {
                return page;
            }

            return {
                ...page,
                blockIds:
                    page.blockIds.filter(
                        (id) =>
                            id !== blockId
                    ),
            };
        });

    setPages(updatedPages);
    savePages(updatedPages);

    setFocusedBlockId(
        previousBlockId
    );
}


function handleDeletePage(
    pageId: string
)
{
    // -------------------------
    // Remove page
    // -------------------------

    const updatedPages =
        pages.filter(
            (page) =>
                page.id !== pageId
        );

    setPages(updatedPages);
    savePages(updatedPages);

    // -------------------------
    // Remove blocks
    // -------------------------

    const updatedBlocks =
        blocks.filter(
            (block) =>
                block.pageId !== pageId
        );

    setBlocks(updatedBlocks);
    saveBlocks(updatedBlocks);

    // -------------------------
    // Remove pageId
    // from notebook
    // -------------------------

    const updatedNotebooks =
        notebooks.map(
            (notebook) => ({
                ...notebook,
                pageIds:
                    notebook.pageIds.filter(
                        (id) =>
                            id !== pageId
                    ),
            })
        );

    setNotebooks(updatedNotebooks);
    saveNotebooks(updatedNotebooks);

    // -------------------------
    // Clear selection
    // -------------------------

    if (
        selectedPageId === pageId
    )
    {
        setSelectedPageId(null);
    }
}


function handleDeleteNotebook(
    notebookId: string
)
{
    const pagesToDelete =
        pages.filter(
            page =>
                page.notebookId === notebookId
        );

    const pageIds =
        pagesToDelete.map(
            page => page.id
        );

    const updatedNotebooks =
        notebooks.filter(
            notebook =>
                notebook.id !== notebookId
        );

    const updatedPages =
        pages.filter(
            page =>
                page.notebookId !== notebookId
        );

    const updatedBlocks =
        blocks.filter(
            block =>
                !pageIds.includes(
                    block.pageId
                )
        );

    setNotebooks(updatedNotebooks);
    saveNotebooks(updatedNotebooks);

    setPages(updatedPages);
    savePages(updatedPages);

    setBlocks(updatedBlocks);
    saveBlocks(updatedBlocks);

    if (
        selectedNotebookId ===
        notebookId
    )
    {
        setSelectedNotebookId(null);
        setSelectedPageId(null);
        setFocusedBlockId(null);
    }
}


function handleCreateBlockAtEnd()
{
    if (!selectedPage)
    {
        return;
    }

    const newBlock =
        createEmptyBlock(
            selectedPage.id
        );

    const updatedBlocks = [
        ...blocks,
        newBlock,
    ];

    setBlocks(updatedBlocks);
    saveBlocks(updatedBlocks);

    const updatedPages =
        pages.map((page) =>
        {
            if (
                page.id !== selectedPage.id
            )
            {
                return page;
            }

            return {
                ...page,
                blockIds: [
                    ...page.blockIds,
                    newBlock.id,
                ],
            };
        });

    setPages(updatedPages);
    savePages(updatedPages);

    setFocusedBlockId(
        newBlock.id
    );
}


function handleCanvasClick(
    event: React.MouseEvent
) {
    if (
        event.target !== event.currentTarget
    ) {
        return;
    }

    handleCreateBlockAtEnd();
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
                onDeletePage={handleDeletePage}
                onDeleteNotebook={handleDeleteNotebook}
            />

            {/* ==========================================
                Document Workspace
            ========================================== */}
            <main style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    padding: "40px",
                    overflowY: "auto",
                }}
            >
                {selectedPage ? (
                    <div  style={{
                            width: "95%",
                            maxWidth: "100%",
                            backgroundColor: "rgba(20, 12, 55, 0.38)",
                            borderRadius: "10px",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                            padding: "48px",
                            minHeight: "900px",
                            boxSizing: "border-box",
                        }}
                    >
                        {/* Page Header */}
                        <input  type="text"
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
                        <p  style={{
                                color: "#777",
                                fontSize: ".9rem",
                                marginBottom: "24px",
                            }}
                        >
                            Last edited: Just now
                        </p>

                        <hr   style={{
                                border: "none",
                                borderTop: "1px solid #e5e5e5",
                                marginBottom: "40px",
                            }}
                        />

                        {/* ======================================
                            DOCUMENT BODY (NOW LIVE EDITOR)
                        ====================================== */}
                        <div style={{ minHeight: "600px" }}>
                            <div
                                onClick={handleCanvasClick}
                                style={{
                                    minHeight: "600px",
                                }}
>
                            <BlockList
                                page={selectedPage}
                                blocks={blocks}
                                onUpdateBlock={handleUpdateBlock}
                                onCreateBlockAfter={ handleCreateBlockAfter }
                                onDeleteBlock={ handleDeleteBlock }
                                focusedBlockId={focusedBlockId}
                            />
                            </div>
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