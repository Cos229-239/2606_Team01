import type { Journey, JourneyFolder } from "../types";

const FOLDERS_KEY = "journeyFolders";
const STORAGE_KEY = "journeys";

// ======================================================
// Load Journeys
// ======================================================
export function loadJourneys(): Journey[]
{
    const storedJourneys = localStorage.getItem(STORAGE_KEY);

    if (!storedJourneys)
    {
        return [];
    }

    try
    {
        return JSON.parse(storedJourneys);
    }
    catch
    {
        return [];
    }
}

// ======================================================
// Save Journeys (core persistence function)
// ======================================================
export function saveJourneys(journeys: Journey[]): void
{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(journeys));
}

// ======================================================
// Add Journey
// ======================================================
export function addJourney(journey: Journey): Journey[]
{
    const existingJourneys = loadJourneys();

    const updatedJourneys = [
        ...existingJourneys,
        journey,
    ];

    saveJourneys(updatedJourneys);

    return updatedJourneys;
}

// ======================================================
// Update Journey
// ======================================================
export function updateJourney(updatedJourney: Journey): Journey[]
{
    const existingJourneys = loadJourneys();

    const updatedJourneys = existingJourneys.map((journey) =>
    {
        if (journey.journeyId !== updatedJourney.journeyId)
        {
            return journey;
        }

        return updatedJourney;
    });

    saveJourneys(updatedJourneys);

    return updatedJourneys;
}

// ======================================================
// Delete Journey
// ======================================================
export function deleteJourney(journeyId: string): Journey[]
{
    const existingJourneys = loadJourneys();

    const updatedJourneys = existingJourneys.filter(
        (journey) => journey.journeyId !== journeyId
    );

    saveJourneys(updatedJourneys);

    return updatedJourneys;
}

// ======================================================
// Folder Storage
// ======================================================

export function loadJourneyFolders(): JourneyFolder[]
{
    const stored = localStorage.getItem(FOLDERS_KEY);

    if (!stored)
    {
        return [];
    }

    try
    {
        return JSON.parse(stored);
    }
    catch
    {
        return [];
    }
}

export function saveJourneyFolders(
    folders: JourneyFolder[]
)
{
    localStorage.setItem(
        FOLDERS_KEY,
        JSON.stringify(folders)
    );
}