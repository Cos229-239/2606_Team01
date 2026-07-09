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

         const createdDate =
        journey
            ? new Date(journey.createdAt).toLocaleDateString()
            : "-";


        const journeyLifetime =
            journey
                ? Math.floor(
                    (
                        Date.now() -
                        new Date(journey.createdAt).getTime()
                    ) /
                    (1000 * 60 * 60 * 24)
                )
                : 0;

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


                <div>
                    <h3>Journey</h3>

                    <p>
                        <strong>Notebook:</strong>{" "}
                        {notebookTitle}
                    </p>

                    <p>
                        <strong>Created:</strong>{" "}
                        {createdDate}
                    </p>

                    <p>
                        <strong>Journey Lifetime:</strong>{" "}
                        {journeyLifetime} day
                         {journeyLifetime !== 1 ? "s" : ""}
                    </p>
                </div>

  <div>
                    <h3>Sessions</h3>

                    <p>
                        <strong>Total Sessions:</strong>{" "}
                        {sessionCount}
                    </p>

                    <p>
                        <strong>Completed Sessions:</strong>{" "}
                        {completedCount}
                    </p>

                    <p>
                        <strong>Total Session Time:</strong>{" "}
                        {totalMinutes} minutes
                    </p>
                </div>

            </div>

        </div>
    );
}