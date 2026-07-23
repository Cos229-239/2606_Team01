import type { Journey } from "../types";
import type { Notebook } from "../../notes/types";
import type { Page } from "../../notes/types";
import { useState } from "react";
import { useConfirmDelete } from "../../../Components/ConfirmDialog";
import SortControl from "../../../Components/SortControl";
import type { SortDirection } from "../../../Components/SortControl";
import Tooltip from "../../../Components/Tooltip";

import
{
    sortJourneysByTitle,
    sortJourneysByCreatedDate,
    sortJourneysByRecentActivity,
    sortJourneysBySessionCount,
}
from "../Utils/journeySorting";

interface JourneyBrowserProps
{
    journeys: Journey[];

    notebooks: Notebook[];
    pages: Page[];

    selectedJourneyId: string | null;

    onCreateJourney: () => void;

    onSelectedJourney: (journeyId: string) => void;

    selectedPageId: string | null;

    onSelectedPage: (pageId: string) => void;
    onDeleteNotebook: (notebookId: string) => void;


    onCreatePage: (notebookId: string) => void;
    onDeletePage: (pageId: string) => void;

    onRenameNotebook: (
        notebookId: string,
        title: string
    ) => void;
}



export default function JourneyBrowser(
{
    journeys,
    notebooks,
    pages,

    selectedJourneyId,

    onCreateJourney,
    onSelectedJourney,

    selectedPageId,
    onSelectedPage,

    onDeleteNotebook,
    onRenameNotebook,
    onCreatePage,
    onDeletePage,

}: JourneyBrowserProps)

{

    const [editingJourneyId, setEditingJourneyId] =
        useState<string | null>(null);


    const [editingTitle, setEditingTitle] =
        useState("");

    const { requestDelete, confirmDialog } = useConfirmDelete();

    const [sortField, setSortField] =
    useState("created");

    const [sortDirection, setSortDirection] =
        useState<SortDirection>("desc");

    const sortFieldOptions =
    [
        { value: "title", label: "Title" },
        { value: "created", label: "Created" },
        { value: "activity", label: "Recent Activity" },
        { value: "count", label: "Session Count" },
    ];

    function getSortedJourneys()
    {
        switch (sortField)
        {
            case "title":
                return sortJourneysByTitle(
                    journeys, notebooks, sortDirection
                );

            case "activity":
                return sortJourneysByRecentActivity(
                    journeys, sortDirection
                );

            case "count":
                return sortJourneysBySessionCount(
                    journeys, sortDirection
                );

            case "created":
            default:
                return sortJourneysByCreatedDate(
                    journeys, sortDirection
                );
        }
    }

    const sortedJourneys =
        getSortedJourneys();


    return (

        <>
        {confirmDialog}
        <aside
            style={{
                width: "260px",
                padding: "12px",
                borderRight:
                    "1px solid rgba(255,255,255,0.1)",
            }}
        >


            {/* ================= Create Journey ================= */}

          
                 <div
                            style={{
                                display:"flex",
                                gap:"10px",
                                marginTop:"20px",
                                marginBottom: "20px",
                            }}
                        >
            <Tooltip text="Start a new long-running project with its own notebook">
                <button
                    onClick={onCreateJourney}
                    style={{
                        padding: "10px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    + New Journey
                </button>
            </Tooltip>

            
        <SortControl
            fields={sortFieldOptions}
            currentField={sortField}
            currentDirection={sortDirection}
            onChange={(field, direction) =>
            {
                setSortField(field);
                setSortDirection(direction);
            }} />
            </div>

            {/* ================= Empty State ================= */}

            {journeys.length === 0 && (

                <div
                    style={{
                        marginTop: "20px",
                        opacity: 0.7,
                        fontSize: "0.9rem",
                    }}
                >
                    No journeys yet. Create your first journey.
                </div>

            )}

            {/* ================= Journey List ================= */}

            {sortedJourneys.map((journey) =>
            {

                
                const isSelected =
                    selectedJourneyId === journey.journeyId;



                const notebook =
                    notebooks.find(
                        (notebook) =>
                            notebook.id === journey.notebookId
                    );

                if(!notebook)
                {
                    return null;
                }

                /*
                    NOTEBOOK
                       |
                       | notebookId
                       ↓
                    PAGES
                */

                const notebookPages =
                    pages.filter(
                        (page) =>
                            page.notebookId === notebook.id
                    );


                return (

                    <div
                        key={journey.journeyId}
                        style={{
                            marginBottom: "18px",
                        }}
                    >



                        {/* ================= Journey Row ================= */}

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent:
                                    "space-between",
                                gap: "8px",
                            }}
                        >

                            <button

                                onClick={() =>
                                    onSelectedJourney(
                                        journey.journeyId
                                    )
                                }


                                onDoubleClick={() =>
                                {
                                    setEditingJourneyId(
                                        journey.journeyId
                                    );

                                    setEditingTitle(
                                        notebook?.title ??
                                        "Untitled Journey"
                                    );
                                }}


                                style={{
                                    flex: 1,
                                    textAlign: "left",
                                    cursor: "pointer",
                                    padding:
                                        "8px 10px",
                                    borderRadius:
                                        "6px",
                                    

                                    fontWeight:
                                        isSelected
                                            ? "bold"
                                            : "normal",

                                    backgroundColor:
                                        isSelected
                                            ? "rgba(20,12,55,0.38)"
                                            : "transparent",
                                }}
                            >

                                {editingJourneyId === journey.journeyId ? (

                                    <input
                                        autoFocus
                                        onClick={(e) =>
                                            e.stopPropagation()
                                        }
                                        value={editingTitle}
                                        onChange={(e) =>
                                            setEditingTitle(
                                                e.target.value
                                            )
                                        }
                                         onBlur={() =>
                                            {
                                                onRenameNotebook(
                                                    notebook.id,
                                                    editingTitle.trim() ||
                                                    "Untitled Journey"
                                                );

                                            setEditingJourneyId(
                                                null
                                            );
                                        }}

                                         onKeyDown={(e)=>
                                            {
                                                if(e.key === "Enter")
                                                {
                                                    onRenameNotebook(
                                                        notebook.id,
                                                        editingTitle.trim() ||
                                                        "Untitled Journey"
                                                    );

                                                    setEditingJourneyId(
                                                        null
                                                    );
                                                }
                                            }}

                                            style={{
                                                width:"100%",
                                                border:"none",
                                                outline:"none",
                                                background:"transparent",
                                                color:"inherit",
                                                font:"inherit",
                                            }}
                                        />
                                    )  :

                                    notebook.title
                                }

                            </button>


                            <Tooltip text="Delete this journey and all of its sessions">
                                <button
                                    onClick={() =>
                                        requestDelete(
                                            `Delete "${notebook.title || "Untitled Journey"}" and all of its sessions? This can't be undone.`,
                                            () => onDeleteNotebook(notebook.id)
                                        )
                                    }

                                    style={{
                                        border:"none",
                                        background:"transparent",
                                        cursor:"pointer",
                                        opacity:0.5,
                                    }}
                                >
                                    X
                                </button>
                            </Tooltip>


                        </div>

                        {/* ================= Notebook Pages ================= */}

                        {isSelected && (
                            <>
                                <div
                                    style={{
                                        marginLeft: "18px",
                                        marginTop: "12px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "6px",
                                    }}
                                >
                                    {notebookPages.length === 0 && (
                                        <div
                                            style={{
                                                opacity: 0.6,
                                                fontSize: "0.85rem",
                                            }}
                                        >
                                            No Sessions yet.
                                        </div>
                                    )}

                                    {notebookPages.map((page) =>
                                    {
                                        const isSelectedPage =
                                            selectedPageId === page.id;

                                        return (
                                            <div
                                                key={page.id}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                }}
                                            >
                                                <button
                                                    onClick={() =>
                                                        onSelectedPage(page.id)
                                                    }
                                                    style={{
                                                        flex: 1,
                                                        textAlign: "left",
                                                        padding: "6px 8px",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                        backgroundColor:
                                                            isSelectedPage
                                                                ? "rgba(20,12,55,0.38)"
                                                                : "transparent",
                                                    }}
                                                >
                                                    {page.title}
                                                </button>

                                                <Tooltip text="Delete this session">
                                                    <button
                                                        onClick={() =>
                                                            requestDelete(
                                                                `Delete "${page.title || "Untitled Session"}"? This can't be undone.`,
                                                                () => onDeletePage(page.id)
                                                            )
                                                        }
                                                        style={{
                                                            border: "none",
                                                            background: "transparent",
                                                            cursor: "pointer",
                                                            opacity: 0.5,
                                                        }}
                                                    >
                                                        X
                                                    </button>
                                                </Tooltip>
                                            </div>
                                        );
                                    })}
                                </div>

                                <Tooltip text="Add a new session page to this journey">
                                    <button
                                        onClick={() =>
                                            onCreatePage(notebook.id)
                                        }
                                        style={{
                                            marginTop: "10px",
                                            marginLeft: "18px",
                                            padding: "6px 10px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        + New Session
                                    </button>
                                </Tooltip>
                            </>
                        )}
                    </div>
                );
            })}
        </aside>
        </>
    );
}