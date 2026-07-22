// ======================================================
// types.ts
// ------------------------------------------------------
// Defines the Journey data model.
//
// A Journey represents a long-term pursuit and owns
// exactly one Notebook.
// ======================================================


export interface Journey
{
    journeyId: string;
    // Linked Notebook
    notebookId: string;
    // When the Journey was created
    createdAt: string;
    folderId?: string;
    
}

export interface JourneyFolder
{
    id: string;
    title: string;
}
