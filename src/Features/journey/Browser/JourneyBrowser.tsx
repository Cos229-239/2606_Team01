import type { Journey } from "../types";
import { useState } from "react";
import type { Page } from "../../notes/types";

interface JourneyBrowserProps
{
    journeys: Journey[];

    pages: Page[];

    selectedJourneyId: string | null;

    selectedPageId: string | null;

    onCreateJourney: () => void;

    onSelectedJourney: (journeyId: string) => void;

    onSelectedPage: (pageId: string) => void;

    onCreateSession: (journeyId: string) => void;
}

export default function JourneyBrowser(
{
    journeys,
    pages,
    selectedJourneyId,
    selectedPageId,
    onCreateJourney,
    onSelectedJourney,
    onSelectedPage,
    onCreateSession,
}: JourneyBrowserProps)
{
    const [editingJourneyId, setEditingJourneyId] =
        useState<string | null>(null);

    const [editingTitle, setEditingTitle] =
        useState("");

   

    return (
        <aside
            style={{
                width: "260px",
                padding: "12px",
                borderRight: "1px solid rgba(255,255,255,0.1)",
            }}
        >
            {/* ================= Create Journey ================= */}
            <button
                onClick={onCreateJourney}
                style={{
                    marginBottom: "16px",
                    padding: "10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                }}
            >
                + New Journey
            </button>

            {/* ================= Empty State ================= */}
            {journeys.length === 0 && (
                <div style={{ opacity: 0.6 }}>
                    No journeys yet
                </div>
            )}

            {/* ================= Journey List ================= */}
            {journeys.map((journey) => {
                const isSelected =
                    selectedJourneyId === journey.id;

                
                const journeyPages =
                    pages.filter(
                        (page) =>
                            page.notebookId === journey.notebookId
                    );


                return (
                     <div
                        key={journey.id}
                        style={{
                            marginBottom: "18px",
                        }}
                    >
                        {/* ================= Journey Row ================= */}
                        <div
                            onClick={() =>
                                onSelectedJourney(journey.id)
                            }
                            style={{
                                padding: "10px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                backgroundColor: isSelected
                                    ? "rgba(20, 12, 55, 0.38)"
                                    : "transparent",
                            }}
                        >
                            {journey.name}
                        </div>

                        {/* ================= Sessions ================= */}
                        {isSelected && (
                            <>
                                {journeyPages.length > 0 && (
                                    <div
                                        style={{
                                            marginTop: "12px",
                                            marginLeft: "18px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "6px",
                                        }}
                                    >
                                        {journeyPages.map((page) =>
                                        {
                                            const isSelectedPage =
                                                selectedPageId === page.id;

                                            return (
                                                <button
                                                    key={page.id}
                                                    onClick={() =>
                                                        onSelectedPage(page.id)
                                                    }
                                                    style={{
                                                        textAlign: "left",
                                                        padding: "6px 8px",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                        backgroundColor:
                                                            isSelectedPage
                                                                ? "rgba(20, 12, 55, 0.38)"
                                                                : "transparent",
                                                    }}
                                                >
                                                    {page.title}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                <button
                                    onClick={() =>
                                        onCreateSession(journey.id)
                                    }
                                    style={{
                                        marginTop: "10px",
                                        marginLeft: "10px",
                                        padding: "6px 10px",
                                        cursor: "pointer",
                                    }}
                                >
                                    + New Session
                                </button>
                            </>
                        )}
                    </div>
                );
            })}
        </aside>
    );
}