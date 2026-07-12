import type { Journey } from "../types";


export interface JourneyPlan
{
    journeyId: string;
    purpose: string;
    sessionsPerWeek: number;
    createdAt: string;
}


const STORAGE_KEY = "journeyPlans";

// ======================================================
// LOAD
// ======================================================

export function loadPlans(): JourneyPlan[]
{
    const stored =
        localStorage.getItem(STORAGE_KEY);

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

// ======================================================
// SAVE
// ======================================================

export function savePlans(
    plans: JourneyPlan[]
)
{
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(plans)
    );
}

// ======================================================
// SET (add-or-update by journeyId)
// ======================================================

export function setPlan(
    plan: JourneyPlan
)
{
    const existingPlans =
        loadPlans();

    const alreadyExists =
        existingPlans.some(
            (existingPlan) =>
                existingPlan.journeyId === plan.journeyId
        );

    const updatedPlans =
        alreadyExists
            ? existingPlans.map(
                  (existingPlan) =>
                      existingPlan.journeyId === plan.journeyId
                          ? plan
                          : existingPlan
              )
            : [
                  ...existingPlans,
                  plan,
              ];

    savePlans(updatedPlans);

    return updatedPlans;
}

// ======================================================
// LOOKUP
// ======================================================

export function getPlanByJourneyId(
    journeyId: string
): JourneyPlan | null
{
    return loadPlans().find(
        (plan) =>
            plan.journeyId === journeyId
    ) ?? null;
}

// ======================================================
// DELETE
// ======================================================

export function deletePlan(
    journeyId: string
)
{
    const updatedPlans =
        loadPlans().filter(
            (plan) =>
                plan.journeyId !== journeyId
        );

    savePlans(updatedPlans);

    return updatedPlans;
}