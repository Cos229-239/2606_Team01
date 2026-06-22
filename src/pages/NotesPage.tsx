// ======================================================
// NotesPage.tsx
// ------------------------------------------------------
// Entry point for the Notes feature.
//
// Responsible for coordinating the Notes UI.


import { useEffect, useState } from "react";
import type { Notebook, Page, Block } from "../Features/notes/types";
import { loadNotebooks,loadPages, saveNotebooks, savePages,
            loadBlocks, saveBlocks } from "../Features/notes/storage/notebookStorage";
import NotebookBrowser from "../Features/notes/browser/NotebookBrowser";
import { createNotebook, createPage } from "../Features/notes/utils/NotesFactory";

export default function NotesPage()
{
    const [notebooks, setNotebooks ] = useState <Notebook[]> ([]);
    const [ pages, setPages ] = useState <Page[]> ([]);
    const [blocks, setBlocks] = useState<Block[]>([]);

    const [ selectedNotebookId, setSelectedNotebookId ] = 
            useState <string | null > (null)
    const [ selectedPageId, setSelectedPageId ] = 
            useState <string | null > (null);


    useEffect(() =>
    {
        setNotebooks(loadNotebooks());
        setPages(loadPages());
        setBlocks(loadBlocks());
    }, []);

   

    function handleCreateNotebook()
    {
        const notebook = createNotebook();

        const updatedNotebooks = [ ...notebooks, notebook,];

        setNotebooks(updatedNotebooks);
        saveNotebooks(updatedNotebooks);

            //automatically select created notebook
        setSelectedNotebookId(notebook.id);

            //no page selected 
        setSelectedPageId( null );
    }

    function handleSelectedNotebook(notebookId: string)
    {
        setSelectedNotebookId(notebookId);

          // We'll choose the notebook's first page in a later sprint.
        setSelectedPageId(null);
    }

         // Every page now begins with its first EmptyBlock.
        function handleCreatePage(notebookId: string)
        {
            const {page, block} = createPage(notebookId);
            const updatedPages = [...pages, page];

            setPages(updatedPages);
            savePages(updatedPages);

             const updatedBlocks = [
            ...blocks,  block, ];

        setBlocks(updatedBlocks);
        saveBlocks(updatedBlocks);

            const updatedNotebooks = notebooks.map((notebook) =>
            {
                if (notebook.id !== notebookId) return notebook;
                return {
                    ...notebook, pageIds: [ ...notebook.pageIds, page.id],
                };
            });
            setNotebooks(updatedNotebooks);
            saveNotebooks(updatedNotebooks);

            setSelectedPageId(page.id);


        }

         function handleSelectedPage(pageId: string)
        {
            setSelectedPageId(pageId);
        }

   
        // Updates the page title immediately and persists it.
    function handlePageTitleChange(title: string)
    {
        if (!selectedPageId)
        {
            return;
        }

        const updatedPages = pages.map((page) =>
        {
            if (page.id !== selectedPageId)
            {
                return page;
            }

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

 return (
        <div>
            <NotebookBrowser
                notebooks={notebooks}
                pages={pages}
                selectedNotebookId={selectedNotebookId}
                onCreateNotebook={handleCreateNotebook}
                onSelectedNotebook={handleSelectedNotebook}
                onCreatePage={handleCreatePage}
                onSelectedPage={handleSelectedPage}
            />

            {/* SIMPLE PAGE VIEW */}
            <div style={{ marginTop: "20px" }}>
                {selectedPage ? (
                    <div>
                        <h2>{selectedPage.title}</h2>
                        <p>Empty page (editor coming next)</p>
                    </div>
                ) : (
                    <p>Select a page</p>
                )}
            </div>
        </div>
    );
}