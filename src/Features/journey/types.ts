// ======================================================
// types.ts
// ------------------------------------------------------
// Defines the Journey data model.
//
// A Journey represents a long-term pursuit and owns
// exactly one Notebook.
// ======================================================

export interface JourneyStatistics
{
    totalHours: number;
    totalSessions: number;
    lastWorked: string | null;
}

export interface Journey
{
    journeyId: string;
    // Linked Notebook
    notebookId: string;
    
}

export interface Journeyold
{

    // ======================================================
    // Current Journey Model
    // ------------------------------------------------------
    // Journey currently acts as a wrapper around an existing
    // Notebook. Additional Journey metadata will be added
    // later without changing the Notebook relationship.
    // ======================================================

    id: string;

    // Linked Notebook
    notebookId: string;

    // Identity
    name: string;
    goal: string;
    mantra: string;
    currentFocus: string;

    // Configuration
    preferredSessionLength: number;
    plannedDays: string[];

    // Metadata
    createdDate: string;

    // Placeholder statistics
    statistics: JourneyStatistics;
}
