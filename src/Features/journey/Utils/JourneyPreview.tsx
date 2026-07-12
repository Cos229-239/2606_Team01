import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Journey } from "../types";
import { loadJourneys } from "../Storage/journeyStorage";

import type { JourneySession } from "../Session/journeySession";
import { loadSessions } from "../Session/journeySession";

import type { JourneyPlan } from "../Plan/journeyPlan";
import { loadPlans } from "../Plan/journeyPlan";

import { getJourneyStats } from "./journeyStats";

import type { Notebook } from "../../notes/types";
import { loadNotebooks } from "../../notes/storage/notebookStorage";

import PreviewLayout from "../../../Components/Dashboard/PreviewLayout";


// ======================================================
// NOTEBOOK SELECT POPUP
// ======================================================
// CHANGED: extracted into a local sub-component. Previously
// this exact JSX block was duplicated in both the "nothing
// selected yet" render path and inside the Identity slot of
// the "selected" render path. Now both call this once.

interface NotebookSelectPopupProps
{
    journeys: Journey[];
    notebooks: Notebook[];
    onSelect: (journeyId: string) => void;
    onClose: () => void;
}

function NotebookSelectPopup(
{
    journeys,
    notebooks,
    onSelect,
    onClose,

}: NotebookSelectPopupProps)
{
    return (
        <div
            style={{
                position: "relative",
                 width: 300,
                background: "#1a1a2e",
                borderRadius: 8,
                padding: 12,
                zIndex: 1000,
            }}
        >
            <h4>Select Notebook</h4>

            {journeys.map((journey) =>
            {
                const notebook =
                    notebooks.find(
                        (notebookItem) =>
                            notebookItem.id === journey.notebookId
                    );

                return (
                    <div
                        key={journey.journeyId}
                        onClick={() => onSelect(journey.journeyId)}
                        style={{
                            padding: "10px",
                            cursor: "pointer",
                            borderBottom:
                                "1px solid rgba(255,255,255,.15)",
                        }}
                    >
                        {notebook?.title ?? "Untitled Journey"}
                    </div>
                );
            })}

            <button onClick={onClose}>
                Close
            </button>
        </div>
    );
}


// ======================================================
// JOURNEY PREVIEW
// ======================================================

export default function JourneyPreview()
{
    const navigate =
        useNavigate();

    // ======================================================
    // DATA
    // ======================================================

    const [journeys, setJourneys] =
        useState<Journey[]>([]);

    const [sessions, setSessions] =
        useState<JourneySession[]>([]);

    const [plans, setPlans] =
        useState<JourneyPlan[]>([]);

    const [notebooks, setNotebooks] =
        useState<Notebook[]>([]);

    useEffect(() =>
    {
        setJourneys(loadJourneys());
        setSessions(loadSessions());
        setPlans(loadPlans());
        setNotebooks(loadNotebooks());

    }, []);

    // ======================================================
    // NOTEBOOK SELECTION
    // ======================================================

    const [selectedJourneyId, setSelectedJourneyId] =
        useState<string | null>(null);

    const [showSelectPopup, setShowSelectPopup] =
        useState(false);

    const selectedJourney =
        journeys.find(
            (journey) =>
                journey.journeyId === selectedJourneyId
        ) ?? null;

    const selectedNotebook =
        selectedJourney
            ? notebooks.find(
                  (notebook) =>
                      notebook.id === selectedJourney.notebookId
              ) ?? null
            : null;

    const relevantSessions =
        sessions.filter(
            (session) =>
                session.journeyId === selectedJourneyId
        );

    const selectedPlan =
        plans.find(
            (plan) =>
                plan.journeyId === selectedJourneyId
        ) ?? null;

    function handleSelectJourney(journeyId: string)
    {
        setSelectedJourneyId(journeyId);
        setShowSelectPopup(false);
    }

    // ======================================================
    // CURRENT STATE
    // ======================================================

    const stats =
        getJourneyStats(selectedJourney, relevantSessions);

    // ======================================================
    // RECOMMENDATION
    // ======================================================

    const sevenDaysAgo =
        Date.now() - 7 * 24 * 60 * 60 * 1000;

    const sessionsThisWeek =
        relevantSessions.filter(
            (session) =>
                session.status === "Completed" &&
                session.startedAt &&
                new Date(session.startedAt).getTime() >= sevenDaysAgo
        ).length;

    const weeklyGoal =
        selectedPlan?.sessionsPerWeek ?? 0;

    const remainingSessions =
        weeklyGoal - sessionsThisWeek;

    const recommendationText =
        weeklyGoal === 0
            ? "Set a weekly session goal to get a recommendation."
            : remainingSessions <= 0
                ? "You've hit your weekly goal. Nice work."
                : `${remainingSessions} more session${remainingSessions === 1 ? "" : "s"} will complete your weekly goal.`;

    // ======================================================
    // RENDER — NOTHING SELECTED YET
    // ======================================================

    if (!selectedJourneyId)
    {
        return (
            <div style={{ position: "relative" }}>
                <p>Select a notebook to see its Journey info.</p>

                <button onClick={() => setShowSelectPopup(true)}>
                    Select Notebook
                </button>

                {showSelectPopup && (
                    <NotebookSelectPopup
                        journeys={journeys}
                        notebooks={notebooks}
                        onSelect={handleSelectJourney}
                        onClose={() => setShowSelectPopup(false)}
                    />
                )}
            </div>
        );
    }

    // ======================================================
    // RENDER — SELECTED JOURNEY
    // ======================================================

    return (
        <PreviewLayout

            identity={
                <div style={{ position: "relative" }}>
                    <button onClick={() => setShowSelectPopup(true)}>
                        Change Notebook
                    </button>

                    <h3>{selectedNotebook?.title ?? "Untitled Journey"}</h3>
                    <p>{selectedPlan?.purpose ?? "No purpose set yet."}</p>

                    {showSelectPopup && (
                        <NotebookSelectPopup
                            journeys={journeys}
                            notebooks={notebooks}
                            onSelect={handleSelectJourney}
                            onClose={() => setShowSelectPopup(false)}
                        />
                    )}
                </div>
            }

            currentState={
                <div>
                    <p>Total Sessions: {stats.sessionCount}</p>
                    <p>Completed Sessions: {stats.completedCount}</p>
                    <p>Total Session Time: {stats.totalMinutes} minutes</p>
                    <p>Journey Lifetime: {stats.journeyLifetime} days</p>
                </div>
            }

            recommendation={
                <p>{recommendationText}</p>
            }

           quickActions={
    <div>
        <button
            onClick={() =>
                navigate(`/journey?journeyId=${selectedJourneyId}`)
            }
        >
            Open {selectedNotebook?.title ?? "Journal"}
        </button>

        <button onClick={() => navigate("/journey")}>
            Open Journey
        </button>

        
    </div>
}
        />
    );
}