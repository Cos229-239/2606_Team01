// ======================================================
// create.ts
// ------------------------------------------------------
// Helper functions for creating Notes objects.
//
// Every new Notebook, Page, and Block should be created
// through these functions to ensure they always start
// in a valid state.
//

import type { Notebook, Page, EmptyBlock } from "../types";

        //Notebook
        export function createNotebook(title = "Untitled Notebook"): Notebook
        {
            return {
                id: crypto.randomUUID(),
                title,
                pageIds: [],
                settings: {},

            };
        }

            //page
            export function createPage( notebookId: string,
                title = "Untitled Page"
            ): Page
            {
                return {
                    id:crypto.randomUUID(),
                    notebookId,
                    title,
                    blockIds: [],
                };
            }

            //empty Block
        export function createEmptyBlock( pageId: string):
        EmptyBlock
        {
            return {
                id:crypto.randomUUID(),
                    pageId,
                    type: "empty",
                    content: null,

            };
        }