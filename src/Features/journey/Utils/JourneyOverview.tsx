import type { Journey } from "../types";

import type { JourneySession } from "../Session/journeySession";

import { getJourneyStats } from "./journeyStats";

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


   const {
        sessionCount,
        completedCount,
        totalMinutes,
        createdDate,
        journeyLifetime,
    } = getJourneyStats(journey, journeySessions);


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