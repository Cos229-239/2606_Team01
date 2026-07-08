import type { JourneySession } from "../Session/journeySession";


const STORAGE_KEY = "journeySessions";



export function loadSessions(): JourneySession[]
{
    const stored =
        localStorage.getItem(STORAGE_KEY);


    if(!stored)
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



export function saveSessions(
    sessions: JourneySession[]
)
{
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(sessions)
    );
}



export function addSession(
    session: JourneySession
)
{
    const sessions =
        loadSessions();


    const updated =
    [
        ...sessions,
        session,
    ];


    saveSessions(updated);


    return updated;
}