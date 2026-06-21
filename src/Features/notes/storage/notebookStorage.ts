// ======================================================
// notebookStorage.ts
// ------------------------------------------------------
// Handles saving and loading Notes data.
//
// This is the only file that should directly interact
// with localStorage.

import type { Notebook, Page, Block} from "../types";

    //storage keys
const NOTEBOOKS_KEY = "notes.notebooks";
const PAGES_KEY = "notes.pages";
const BLOCKS_KEY = "notes.blocks";

    //notebook storage
export function loadNotebooks(): Notebook[]
{
    const data = localStorage.getItem(NOTEBOOKS_KEY);

    if (!data)
    {
        return [];
    }

    return JSON.parse(data);
}

export function saveNotebooks(notebooks: Notebook[]): void{
    localStorage.setItem(NOTEBOOKS_KEY, JSON.stringify(notebooks));
}


    //Page storage
export function loadPages(): Page[]
{
    const data = localStorage.getItem(PAGES_KEY);

    if (!data)
    {
        return [];
    }

    return JSON.parse(data);
}

export function savePages(pages: Page[]): void{
    localStorage.setItem(PAGES_KEY, JSON.stringify(pages));
}


//Blocks storage
export function loadBlocks(): Page[]
{
    const data = localStorage.getItem(BLOCKS_KEY);

    if (!data)
    {
        return [];
    }

    return JSON.parse(data);
}

export function saveBlocks(blocks: Block[]): void{
    localStorage.setItem(BLOCKS_KEY, JSON.stringify(blocks));
}


