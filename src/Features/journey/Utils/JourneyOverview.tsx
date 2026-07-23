import type { Journey } from "../types";

import type { JourneySession } from "../Session/journeySession";

import { getJourneyStats } from "./journeyStats";
// ADD to imports:
import { useEffect, useState } from "react";

import type { JourneyPlan } from "../Plan/journeyPlan";
import { getPlanByJourneyId, setPlan } from "../Plan/journeyPlan";

import JourneyPlanPopup from "../Plan/JourneyPlanPopup";
import Tooltip from "../../../Components/Tooltip";

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


    const [currentPlan, setCurrentPlan] =
    useState<JourneyPlan | null>(null);

    const [showPlanPopup, setShowPlanPopup] =
        useState(false);

    useEffect(() =>
    {
        if (!journey)
        {
            setCurrentPlan(null);
            return;
        }

        setCurrentPlan(
            getPlanByJourneyId(journey.journeyId)
        );

    }, [journey]);

    function handleSavePlan(data:
    {
        purpose: string;
        sessionsPerWeek: number;
    })
    {
    if (!journey)
    {
        return;
    }

    const updatedPlan: JourneyPlan =
    {
        journeyId: journey.journeyId,
        purpose: data.purpose,
        sessionsPerWeek: data.sessionsPerWeek,
        createdAt: currentPlan?.createdAt ?? new Date().toISOString(),
    };

    setPlan(updatedPlan);

    setCurrentPlan(updatedPlan);

    setShowPlanPopup(false)
}
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
                        <strong>Journey Title:</strong>{" "}
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

                    <div>
                <Tooltip text="Set a purpose and a weekly session target for this journey">
                        <button onClick={() => setShowPlanPopup(true)}>
                            {currentPlan ? "Edit Plan" : "Set Journey Plan"}
                        </button>
                    </Tooltip>
                    <br />
                    <br/>
            <h3>Journey Plan</h3>

            {currentPlan ? (
        <>
            <p>
                <strong>Purpose:</strong>{" "}
                {currentPlan.purpose}
            </p>

            <p>
                <strong>Sessions Per Week:</strong>{" "}
                {currentPlan.sessionsPerWeek}
            </p>
                        </>
                    ) : (
                        <p>No plan set yet.</p>
                    )}

                    
                </div>

                    <br />
                    <h3>Sessions</h3>
                {showPlanPopup && journey && (
                    <JourneyPlanPopup
                        initialPurpose={currentPlan?.purpose}
                        initialSessionsPerWeek={currentPlan?.sessionsPerWeek}
                        onClose={() => setShowPlanPopup(false)}
                        onSave={handleSavePlan}
                    />
                )}

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