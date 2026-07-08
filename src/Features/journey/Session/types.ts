export type SessionMood =
    | "Focus"
    | "Planning"
    | "Recharge";


export interface JourneySession
{
    sessionId: string;

    journeyId: string;

    pageId: string;

    startedAt: string;

    plannedDuration: number;

    mood: SessionMood;

    goal: string;

    actualDuration?: number;
}