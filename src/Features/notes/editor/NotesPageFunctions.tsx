import { useState, useEffect } from "react";
import type { Notebook, Page, Block, BlockType } from "../types";
import type { Task } from "../../../Data/tasks";
import {
    getSessionByPageId,
} from "../../journey/Session/journeySession";
import {
    loadNotebooks,  saveNotebooks,    loadPages,
    savePages,  loadBlocks,  saveBlocks,
} from "../storage/notebookStorage";

import { loadTasks, saveTasks } from "../../../Data/taskStorage";

import {
    createNotebook,  createPage,
} from "../utils/NotesFactory";
import { deleteSession } from "../../journey/Storage/sessionStorage";

export function useNotesPageFunctions({
    selectedPageId,
}: {
    selectedPageId: string | null;
}){


    // ==================================================
    // State
    // ==================================================

    const [notebooks, setNotebooks] = useState<Notebook[]>([]);
    const [pages, setPages] = useState<Page[]>([]);
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);

    const [selectedNotebookId, setSelectedNotebookId] =
        useState<string | null>(null);
 
    const [focusedBlockId, setFocusedBlockId] =
        useState<string | null>(null);

    const [showTaskPicker, setShowTaskPicker] =
        useState(false);

    // ==================================================
    // Effects
    // ==================================================

    useEffect(() =>
    {
        setNotebooks(loadNotebooks());
        setPages(loadPages());
        setBlocks(loadBlocks());
        setTasks(loadTasks());
    }, []);

    // ==================================================
    // Derived State
    // ==================================================

    const selectedPage =
        pages.find(
            (page) =>
                page.id === selectedPageId
        );


        function reloadData()
{
    setNotebooks(loadNotebooks());
    setPages(loadPages());
    setBlocks(loadBlocks());
    setTasks(loadTasks());
}
   
    // ==================================================
    // Notebook Actions
    // ==================================================

    

    function handleCreateNotebook()
    {
        const notebook = createNotebook();

        const updatedNotebooks = [
            ...notebooks,
            notebook,
        ];

        setNotebooks(updatedNotebooks);
        saveNotebooks(updatedNotebooks);

        setSelectedNotebookId(notebook.id);;
    }

    function handleSelectedNotebook(
        notebookId: string
    )
    {
        setSelectedNotebookId(notebookId);
    }

    function handleRenameNotebook(
        notebookId: string,
        title: string
    )
    {
        const updatedNotebooks =
            notebooks.map((notebook) =>
            {
                if (
                    notebook.id !== notebookId
                )
                {
                    return notebook;
                }

                return {
                    ...notebook,
                    title,
                };
            });

        setNotebooks(updatedNotebooks);
        saveNotebooks(updatedNotebooks);
    }
    
    function handleDeleteNotebook(notebookId: string)
{
    const pagesToDelete = pages.filter(
        (page) => page.notebookId === notebookId
    );

    const pageIds = pagesToDelete.map((page) => page.id);

    const updatedNotebooks = notebooks.filter(
        (notebook) => notebook.id !== notebookId
    );

    const updatedPages = pages.filter(
        (page) => page.notebookId !== notebookId
    );

    const updatedBlocks = blocks.filter(
        (block) => !pageIds.includes(block.pageId)
    );

    setNotebooks(updatedNotebooks);
    saveNotebooks(updatedNotebooks);

    setPages(updatedPages);
    savePages(updatedPages);

    setBlocks(updatedBlocks);
    saveBlocks(updatedBlocks);

    if (selectedNotebookId === notebookId)
    {
        setSelectedNotebookId(null);
    }
}

    // ==================================================
    // Page Actions
    // ==================================================

    function handleCreatePage(
        notebookId: string
    )
    {
        const { page, block } =
            createPage(notebookId);

        const updatedPages = [
            ...pages,
            page,
        ];

        setPages(updatedPages);
        savePages(updatedPages);

        const updatedBlocks = [
            ...blocks,
            block,
        ];

        setBlocks(updatedBlocks);
        saveBlocks(updatedBlocks);

        const updatedNotebooks =
            notebooks.map((notebook) =>
            {
                if (
                    notebook.id !== notebookId
                )
                {
                    return notebook;
                }

                return {
                    ...notebook,
                    pageIds: [
                        ...notebook.pageIds,
                        page.id,
                    ],
                };
            });

        setNotebooks(updatedNotebooks);
        saveNotebooks(updatedNotebooks);

        return page;
    }

    function handleSelectedPage(
        _pageId: string
    )
    {}

    function handlePageTitleChange(
        title: string
    )
    {
        if (!selectedPageId)
        {
            return;
        }

        const updatedPages =
            pages.map((page) =>
            {
                if (
                    page.id !== selectedPageId
                )
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

    function handleDeletePage(
        pageId: string
    )
    {
    const updatedPages = pages.filter(
        (page) => page.id !== pageId
    );

    setPages(updatedPages);
    savePages(updatedPages);

    const updatedBlocks = blocks.filter(
        (block) => block.pageId !== pageId
    );

    setBlocks(updatedBlocks);
    saveBlocks(updatedBlocks);

    const updatedNotebooks = notebooks.map((notebook) => ({
        ...notebook,
        pageIds: notebook.pageIds.filter((id) => id !== pageId),
    }));

    setNotebooks(updatedNotebooks);
    saveNotebooks(updatedNotebooks);

   
    const session =
    getSessionByPageId(pageId);


        if(session)
        {
            deleteSession(
                session.sessionId
            );
        }
    }

    // ==================================================
    // Block Actions
    // ==================================================

    function handleUpdateBlock( blockId: string, 
            content: any)
    {
        const updatedBlocks = blocks.map((block) =>
    {
        if (block.id !== blockId) return block;

        return {
            ...block,
            content,
        };
    });

    setBlocks(updatedBlocks);
    saveBlocks(updatedBlocks);
    }

    function handleCreateBlockAfter(
        blockId: string
    )
    {
    if (!selectedPage) return;

    const newBlock = {
        id: crypto.randomUUID(),
        pageId: selectedPage.id,
        type: "empty",
        content: "",
    } as Block;

    const updatedBlocks = [...blocks, newBlock];

    setBlocks(updatedBlocks);
    saveBlocks(updatedBlocks);

    const updatedPages = pages.map((page) =>
    {
        if (page.id !== selectedPage.id) return page;

        const index = page.blockIds.indexOf(blockId);

        const newBlockIds = [...page.blockIds];
        newBlockIds.splice(index + 1, 0, newBlock.id);

        return {
            ...page,
            blockIds: newBlockIds,
        };
    });

    setPages(updatedPages);
    savePages(updatedPages);

    setFocusedBlockId(newBlock.id);
    }

    function handleDeleteBlock( blockId: string  )
    {
    if (!selectedPage) return;

    const page = pages.find((p) => p.id === selectedPage.id);
    if (!page) return;

    if (page.blockIds.length <= 1) return;

    const deletedIndex = page.blockIds.indexOf(blockId);

    const previousBlockId =
        page.blockIds[deletedIndex - 1] ?? null;

    const updatedBlocks = blocks.filter(
        (block) => block.id !== blockId
    );

    setBlocks(updatedBlocks);
    saveBlocks(updatedBlocks);

    const updatedPages = pages.map((page) =>
    {
        if (page.id !== selectedPage.id) return page;

        return {
            ...page,
            blockIds: page.blockIds.filter((id) => id !== blockId),
        };
    });

    setPages(updatedPages);
    savePages(updatedPages);

    setFocusedBlockId(previousBlockId);
    }

    function handleConvertBlock(
        blockId: string, type: BlockType,
        content: any
    ){
        const updatedBlocks = blocks.map((block) =>
        {
            if (block.id !== blockId)
            {
                return block;
            }

             if (block.type === type && block.content === content) 
            {
                return block;
            }

            return  {
                ...block, type, content,
            };
        });

        setBlocks(updatedBlocks);
        saveBlocks(updatedBlocks);

    //  force UI sync boundary
    setFocusedBlockId(blockId);
            }
        
    
    



    function handleCreateBlockAtEnd()
{
    if (!selectedPage) return;

    const newBlock: Block = {
        id: crypto.randomUUID(),
        pageId: selectedPage.id,
        type: "empty",
        content: "",
    };

    const updatedBlocks = [...blocks, newBlock];

    setBlocks(updatedBlocks);
    saveBlocks(updatedBlocks);

    const updatedPages = pages.map((page) =>
    {
        if (page.id !== selectedPage.id) return page;

        return {
            ...page,
            blockIds: [...page.blockIds, newBlock.id],
        };
    });

    setPages(updatedPages);
    savePages(updatedPages);

    setFocusedBlockId(newBlock.id);
}
    // ==================================================
    // Canvas Actions
    // ==================================================

    function handleCanvasClick( event: React.MouseEvent )
    {
        const target = event.target as HTMLElement;

    if (
        target.closest("[data-block]")
    )
    {
        return;
    }

    handleCreateBlockAtEnd();
    }

    function handleInsertTaskBlock(
        taskId: string
    )
    {
       
    if (!selectedPage) return;

    const taskBlock: Block = {
        id: crypto.randomUUID(),
        pageId: selectedPage.id,
        type: "task",
        content: {
            taskId,
        },
    };

    const updatedBlocks = [...blocks, taskBlock];

    setBlocks(updatedBlocks);
    saveBlocks(updatedBlocks);

    const updatedPages = pages.map((page) =>
    {
        if (page.id !== selectedPage.id) return page;

        return {
            ...page,
            blockIds: [...page.blockIds, taskBlock.id],
        };
    });

    setPages(updatedPages);
    savePages(updatedPages);

    // Focus the newly inserted task block
    setFocusedBlockId(taskBlock.id);

    // Close the picker
    setShowTaskPicker(false);
    }

// ==================================================
// Task Actions
// ==================================================

function handleEditTask(updatedTask: Task)
{
    const updatedTasks = tasks.map((task) =>
    {
        if (task.id !== updatedTask.id)
        {
            return task;
        }

        return updatedTask;
    });

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
}

function handleDeleteTask(taskId: string)
{
    const updatedTasks = tasks.filter(
        (task) => task.id !== taskId
    );

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
}

function handleCreateTask(task: Task) 
{
    setTasks(prev => {
        const updated = [...prev, task];

        saveTasks(updated);

        return updated;
    });
}



     // ==================================================
    // Return
    // ==================================================

    return {
        notebooks,
        pages,
        blocks,
        tasks,

        selectedNotebookId,
        selectedPageId,
        focusedBlockId,
        showTaskPicker,

        setShowTaskPicker,

        selectedPage,

        handleCreateNotebook,
        handleSelectedNotebook,
        handleRenameNotebook,
        handleCreatePage,
        handleSelectedPage,
        handlePageTitleChange,
        handleUpdateBlock,
        handleCreateBlockAfter,
        handleDeleteBlock,
        handleDeletePage,
        handleDeleteNotebook,
        handleCreateBlockAtEnd,
        handleCanvasClick,
        handleInsertTaskBlock,
        handleEditTask,
        handleDeleteTask,
        handleConvertBlock,
        handleCreateTask, 
        reloadData,
   
    };
}
