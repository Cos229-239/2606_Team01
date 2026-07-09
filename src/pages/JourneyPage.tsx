import { useEffect, useState } from "react";

import type { Journey } from "../Features/journey/types";
import type { Notebook, Page } from "../Features/notes/types";
import CreateTaskPopup from "../Components/CreateTaskPopup";
import {
    loadJourneys,
    saveJourneys,
} from "../Features/journey/Storage/journeyStorage";

import {
    createJourney,
} from "../Features/journey/Utils/JourneyFactory";

import JourneyBrowser from "../Features/journey/Browser/JourneyBrowser";

import { saveNotebooks} from "../Features/notes/storage/notebookStorage";
import { useNotesPageFunctions } from "../Features/notes/editor/NotesPageFunctions";
import BlockList from "../Features/notes/editor/BlockList";
import StartSessionPopup from "../Features/journey/Session/StartSessionPopup";
import JourneyOverview from "../Features/journey/Utils/JourneyOverview";
import
{
    type JourneySession,

    loadSessions, addSession,
    updateSession, deleteSession,

    getSessionById, getSessionByPageId,
    getSessionsByJourneyId, getActiveSessionForPage,

    startSession, endSession,

    getSessionDuration,

}
from "../Features/journey/Session/journeySession";

export default function JourneyPage()
{

    // ======================================================
    // STATE
    // ======================================================

    const [journeys, setJourneys] =
        useState<Journey[]>([]);



    const [selectedJourneyId, setSelectedJourneyId] =
        useState<string | null>(null);


    const [selectedPageId, setSelectedPageId] =
        useState<string | null>(null);

        
    const [showCreateTaskPopup, setShowCreateTaskPopup] =
        useState(false);

    const [showSessionPopup, setShowSessionPopup] =
    useState(false);


    const [sessions, setSessions] =
        useState<JourneySession[]>([]);


    const [activeSession, setActiveSession] =
        useState<JourneySession | null>(null);

    const {
    notebooks,
    pages,
    blocks,
    tasks,

    focusedBlockId,
    showTaskPicker,
    setShowTaskPicker,

    handlePageTitleChange,
    handleUpdateBlock,
    handleConvertBlock,
    handleCreateBlockAfter,
    handleDeleteBlock,

    handleEditTask,
    handleDeleteTask,
    handleCanvasClick,
    handleInsertTaskBlock,
    handleCreateTask,
    handleCreatePage,
    handleDeletePage,
    reloadData,

} = useNotesPageFunctions({
    selectedPageId,
});

    // ======================================================
    // LOAD DATA
    // ======================================================

    useEffect(() =>
    {
        setJourneys(
            loadJourneys()
        );
    setSessions(
        loadSessions()
    );

}, []);


    // ======================================================
    // CREATE JOURNEY
    // ======================================================

    function handleCreateJourney()
    {
        const {
            journey,
            notebook,
        } =
            createJourney();



        const updatedJourneys =
        [
            ...journeys,
            journey,
        ];



        const updatedNotebooks =
        [
            ...notebooks,
            notebook,
        ];



        saveJourneys(
            updatedJourneys
        );
       
        setJourneys(
            updatedJourneys
        );

        saveNotebooks(updatedNotebooks);
        reloadData();



        setSelectedJourneyId(
            journey.journeyId
        );
    }





    // ======================================================
    // SELECT JOURNEY
    // ======================================================

    function handleSelectJourney(
        journeyId:string
    )
    {
        setSelectedJourneyId(
            journeyId
        );


        setSelectedPageId(
            null
        );
    }





    // ======================================================
    // SELECT PAGE
    // ======================================================

    function handleSelectPage(
        pageId:string
    )
    {
        setSelectedPageId(
            pageId
        );

          const session =
        getActiveSessionForPage(
            pageId
        );

    setActiveSession(
        session
    );
    }



    // ======================================================
    // SESSION
    // ======================================================



function handleStartSession(data:
{
    type:string;
    plannedDuration:number;
    mood:string;
    goal:string;
})
{

    if(!selectedJourneyId)
    {
        return;
    }


    const selectedJourney =
        journeys.find(
            (journey) =>
                journey.journeyId === selectedJourneyId
        );


    if(!selectedJourney)
    {
        return;
    }


    const newPage =
        handleCreatePage(
            selectedJourney.notebookId
        );


    const session: JourneySession =
{
    sessionId:
        crypto.randomUUID(),

    journeyId:
        selectedJourneyId,

    pageId:
        newPage.id,

    status:
        "Planning",

    startedAt:
        undefined,

    endedAt:
        undefined,

    type:
        data.type,

    plannedDuration:
        data.plannedDuration,

    mood:
        data.mood as any,

    goal:
        data.goal,
};


    const updatedSessions =
        addSession(session);


    setSessions(
        updatedSessions
    );


  setSelectedPageId(
    newPage.id
);

setSessions(
    updatedSessions
);

setShowSessionPopup(false);
}


// START ACTIVE SESSION
function handleActivateSession()
{
    if(!activeSession)
    {
        return;
    }


    const updatedSession =
        startSession(
            activeSession.sessionId
        );


    if(!updatedSession)
    {
        return;
    }


    setSessions(
        loadSessions()
    );


    setActiveSession(
        updatedSession
    );
}



// END SESSION
function handleEndSession()
{
    if(!activeSession)
    {
        return;
    }


    const updatedSession =
        endSession(
            activeSession.sessionId
        );


    if(!updatedSession)
    {
        return;
    }


    setSessions(
        loadSessions()
    );


    setActiveSession(
        updatedSession
    );
}

// ======================================================
// ACTIVE SESSION
// ======================================================

useEffect(() =>
{
    if (!selectedPageId)
    {
        setActiveSession(null);
        return;
    }

    const session =
        getActiveSessionForPage(
            selectedPageId
        );

    setActiveSession(
        session
    );

}, [
    selectedPageId,
    sessions,
]);



    // ======================================================
    // DELETE NOTEBOOK
    // ======================================================

    function handleDeleteNotebook(
        notebookId:string
    )
    {

        const updatedNotebooks =
            notebooks.filter(
                (notebook)=>
                    notebook.id !== notebookId
            );


        const updatedJourneys =
            journeys.filter(
                (journey)=>
                    journey.notebookId !== notebookId
            );



        saveJourneys(
            updatedJourneys
        );



        saveNotebooks(updatedNotebooks);
        reloadData();

        setJourneys(
            updatedJourneys
        );



        const deletedJourney =
            journeys.find(
                (journey)=>
                    journey.notebookId === notebookId
            );


        if(
            deletedJourney &&
            deletedJourney.journeyId === selectedJourneyId
        )
        {
            setSelectedJourneyId(null);

            setSelectedPageId(null);
        }

    }





    // ======================================================
    // RENAME NOTEBOOK
    // ======================================================

    function handleRenameNotebook(
        notebookId:string,
        title:string
    )
    {

        const updatedNotebooks =
            notebooks.map(
                (notebook)=>
                {

                    if(
                        notebook.id === notebookId
                    )
                    {
                        return {
                            ...notebook,
                            title,
                        };
                    }


                    return notebook;

                }
            );

        saveNotebooks(updatedNotebooks);
        reloadData();

    }





    // ======================================================
    // SELECTED PAGE, JOURNEY, NOTEBOOK
    // ======================================================

    const selectedPage =
        pages.find(
            (page)=>
                page.id === selectedPageId
        );

        const selectedJourney =
    journeys.find(
        (journey) =>
            journey.journeyId === selectedJourneyId
    );


const selectedNotebook =
    notebooks.find(
        (notebook) =>
            notebook.id === selectedJourney?.notebookId
    );


const journeySessions =
    selectedJourney
        ?
        getSessionsByJourneyId(
            selectedJourney.journeyId
        )
        :
        [];
        



    // ======================================================
    // RENDER
    // ======================================================

    return (

        <div
            style={{
                display:"flex",
                height:"100vh",
                backgroundColor:
                    "rgba(20,12,55,0.38)",
            }}
        >


            <JourneyBrowser

                journeys={journeys}
                notebooks={notebooks}
                pages={pages}

                selectedJourneyId={ selectedJourneyId
                }
                selectedPageId={ selectedPageId
                }
               onCreateJourney={  handleCreateJourney
                }
                onSelectedJourney={     handleSelectJourney
                }
                onSelectedPage={    handleSelectPage
                }

                onCreatePage={handleCreatePage}
                onDeletePage={handleDeletePage}
                onDeleteNotebook={ handleDeleteNotebook
                }
                onRenameNotebook={  handleRenameNotebook
                }
            />


            <main
                style={{
                    flex:1,
                    display:"flex",
                    justifyContent:"center",
                    padding:"40px",
                    overflowY:"auto",
                }}
            >
            {  selectedPage  ?
    (
        <div
            style={{
                width:"95%",
                backgroundColor:"rgba(20,12,55,0.38)",
                borderRadius:"10px",
                padding:"48px",
                minHeight:"900px",
            }}
        >

                        {/* PAGE TITLE */}
                           
            <input
                type="text"
                value={selectedPage.title}
                onChange={(e)=>
                    handlePageTitleChange(  e.target.value
                    )
                }
                
                  placeholder="Untitled Session"
                style={{
                    width:"100%",
                    fontSize:"2.5rem",
                    fontWeight:"bold",
                    background:"transparent",
                    border:"none",
                    outline:"none",
                }}
            />

                        {/* SESSION META */}

                        <div
                            style={{
                                display:"flex",
                                gap:"10px",
                                marginTop:"20px",
                            }}
                        >

                            {/* PLAN SESSION */}
                            <button
                                onClick={() =>
                                    setShowSessionPopup(true)
                                }
                            >
                                Plan Session
                            </button>


                            {/* START SESSION */}
                            <button
                                onClick={handleActivateSession}
                                disabled={
                                    !activeSession ||
                                    activeSession.status !== "Planning"
                                }
                            >
                                Start Session
                            </button>


                            {/* END SESSION */}
                            <button
                                onClick={handleEndSession}
                                disabled={
                                    !activeSession ||
                                    activeSession.status !== "Active"
                                }
                            >
                                End Session
                            </button>

                        </div>


                        {
                        activeSession &&
                        (
                        <div
                        style={{
                            marginTop:"20px",
                            padding:"12px",
                            borderRadius:"8px",
                            background:"rgba(255,255,255,.05)",
                        }}
                        >

                        <p>
                        Status: {activeSession.status}
                        </p>

                        <p>
                        Type: {activeSession.type}
                        </p>

                        <p>
                        Mood: {activeSession.mood}
                        </p>

                        <p>
                        Duration:
                        {activeSession.plannedDuration}
                        minutes
                        </p>
                        
                        <p>
                        Goal:
                        {activeSession.goal}
                        </p>
                        <p>
                        Started:
                        {
                            activeSession.startedAt
                                ?
                                new Date(
                                    activeSession.startedAt
                                ).toLocaleString()
                                :
                                "Not started"
                        }
                        </p>


                        <p>
                        Ended:
                        {
                            activeSession.endedAt
                                ?
                                new Date(
                                    activeSession.endedAt
                                ).toLocaleString()
                                :
                                "Not completed"
                        }
                            </p>
                        <p>
                         Actual Time:

                        {
                            getSessionDuration(
                                activeSession
                            )
                        }

                        minutes
                        </p>


                        </div>
                        )
                        }
                        {
                        showSessionPopup &&
                        (
                        <StartSessionPopup

                        onClose={() =>
                            setShowSessionPopup(false)
                        }


                        onStart={handleStartSession}

                        />
                        )
                        }
                        {/* TASK CREATION */}
                        <button
                            onClick={() => setShowCreateTaskPopup(true)}
                        >
                            + Create New Task
                        </button>

                        {showCreateTaskPopup && (
                            <CreateTaskPopup
                                onClose={() =>
                                    setShowCreateTaskPopup(false)
                                }
                                onCreate={(task) => {
                                    handleCreateTask(task);
                                    setShowCreateTaskPopup(false);
                                }}
                            />
                        )}

                        {/* TASK PICKER */}
                        <button
                            onClick={() => setShowTaskPicker(true)}
                            style={{ marginBottom: "24px" }}
                        >
                            + Add Task Block
                        </button>

                        {showTaskPicker && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: 160,
                                    right: 48,
                                    width: 300,
                                    background: "#1a1a2e",
                                    borderRadius: 8,
                                    padding: 12,
                                    zIndex: 1000,
                                }}
                            >
                                <h4>Select Task</h4>

                                {tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        onClick={() =>
                                            handleInsertTaskBlock(task.id)
                                        }
                                        style={{
                                            padding: "10px",
                                            cursor: "pointer",
                                            borderBottom:
                                                "1px solid rgba(255,255,255,.15)",
                                        }}
                                    >
                                        {task.title}
                                    </div>
                                ))}

                                <button
                                    onClick={() => setShowTaskPicker(false)}
                                >
                                    Close
                                </button>
                            </div>
                        )}


            <hr
                style={{
                    margin:"40px 0"
                }}
            />

                {/* BLOCK EDITOR */}
            <div
                onClick={handleCanvasClick}
                style={{
                    flex: 1,
                    width: "100%",
                    minHeight: "600px",
                }}
            >
            <BlockList

                page={selectedPage}
                blocks={blocks}
                tasks={tasks}
                onUpdateBlock={
                    handleUpdateBlock
                }
                onConvertBlock={
                    handleConvertBlock
                }
                onCreateBlockAfter={
                    handleCreateBlockAfter
                }
                onDeleteBlock={
                    handleDeleteBlock
                }
                onEditTask={
                    handleEditTask
                }
                onDeleteTask={
                    handleDeleteTask
                }
                focusedBlockId={
                    focusedBlockId
                }

            />
            </div>
        </div>
    )

    :
selectedJourneyId
?
(
    <JourneyOverview

        journey={
            selectedJourney ?? null
        }

        notebookTitle={
            selectedNotebook?.title ?? ""
        }

        sessions={
            journeySessions
        }

    />
)
:
(
    <div
        style={{
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            width:"100%",
            color:"#777",
            fontSize:"1.2rem",
        }}
    >
        Select or create a journey.
    </div>
)
}

</main>


        </div>

    );

}