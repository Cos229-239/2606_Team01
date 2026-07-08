export type SessionMood =
    | "Focused"
    | "Planning"
    | "Recharge";


export interface JourneySession
{
    sessionId: string;

    journeyId: string;

    pageId: string;

    startedAt: string;

    type: string;

    plannedDuration: number;

    mood: SessionMood;

    goal: string;

    actualDuration?: number;
}