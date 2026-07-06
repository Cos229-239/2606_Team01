import type { Journey } from "../types";

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
        if (journey.id !== updatedJourney.id)
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
        (journey) => journey.id !== journeyId
    );

    saveJourneys(updatedJourneys);

    return updatedJourneys;
}