import type { Journey } from "../types";

import type { JourneySession } from "../Session/journeySession";

import {
    getSessionDuration,
} from "../Session/journeySession";


interface JourneyOverviewProps
{
    journey: Journey | null;

    notebookTitle: string;

    sessions: JourneySession[];
}


export default function JourneyOverview(
{
    journey,
    sessions,
    notebookTitle,

}: JourneyOverviewProps)
{

    const journeySessions =
        sessions;


    const sessionCount =
        journeySessions.length;


    const completedSessions =
        journeySessions.filter(
            (session) =>
                session.status === "Completed"
        );


    const completedCount =
        completedSessions.length;


    const totalMinutes =
        completedSessions.reduce(
            (
                total,
                session
            ) =>
            {
                return (
                    total +
                    getSessionDuration(session)
                );
            },
            0
        );


    return (
        <div
            style={{
                width:"95%",
                backgroundColor:
                    "rgba(20,12,55,0.38)",
                borderRadius:"10px",
                padding:"48px",
                minHeight:"500px",
            }}
        >

            <h1>
                Journey Overview
            </h1>


            <h2>
                {
                    journey
                        ?
                        notebookTitle
                        :
                        "No Journey Selected"
                }
            </h2>


            <div
                style={{
                    marginTop:"40px",
                    display:"flex",
                    flexDirection:"column",
                    gap:"20px",
                    fontSize:"1.2rem",
                }}
            >

                <p>
                    Sessions:
                    {" "}
                    {sessionCount}
                </p>


                <p>
                    Completed Sessions:
                    {" "}
                    {completedCount}
                </p>


                <p>
                    Total Session Time:
                    {" "}
                    {totalMinutes}
                    {" "}
                    minutes
                </p>


            </div>

        </div>
    );
}