import { useEffect, useState } from "react";

import type { Journey } from "../Features/journey/types";

import {
    loadJourneys,
    saveJourneys,
} from "../Features/journey/Storage/journeyStorage";

import { createJourney } from "../Features/journey/Utils/JourneyFactory";

import JourneyBrowser from "../Features/journey/Browser/JourneyBrowser";
import StartSessionPopup from "../Features/journey/Session/StartSessionPopup";

import { createPage } from "../Features/notes/utils/NotesFactory";
import { loadPages, savePages } from "../Features/notes/storage/notebookStorage";

import { loadBlocks, saveBlocks, loadNotebooks, saveNotebooks } from "../Features/notes/storage/notebookStorage";
import NotesPage from "./NotesPage";
export default function JourneyPage()
{
    // ======================================================
    // JOURNEY STATE
    // ======================================================
    const [journeys, setJourneys] = useState<Journey[]>([]);
    const [selectedJourneyId, setSelectedJourneyId] =
        useState<string | null>(null);

    const [showSessionPopup, setShowSessionPopup] =
        useState(false);
   
    const [pages, setPages] = useState(loadPages());

    const [activePageId, setActivePageId] = useState<string | null>(null);

   const selectedPage = pages.find(
    (page) =>
        page.id === activePageId &&
        selectedJourney?.notebookId === page.notebookId
);
    
    // Derived selected journey
    const selectedJourney =
        journeys.find((j) => j.id === selectedJourneyId);



    // ======================================================
    // LOAD JOURNEYS ON MOUNT
    // ======================================================
    useEffect(() =>
    {
        const loadedJourneys = loadJourneys();
        setJourneys(loadedJourneys);
    }, []);

    function handleSelectPage(pageId: string)
{
    setActivePageId(pageId);
}

    // ======================================================
    // CREATE JOURNEY
    // ======================================================
    function handleCreateJourney()
    {
        const { journey } = createJourney();

        const updatedJourneys = [...journeys, journey];

        setJourneys(updatedJourneys);
        saveJourneys(updatedJourneys);

        setSelectedJourneyId(journey.id);
    }


    // ======================================================
    // SELECT JOURNEY
    // ======================================================
    function handleSelectJourney(journeyId: string)
    {
        setSelectedJourneyId(journeyId);
    }

    // ======================================================
    // START SESSION (CORE FLOW)
    // Journey → Notes Page Creation Bridge
    // ======================================================


    function handleStartSession(sessionData: 
        {  type: string;
            duration: number;  mood: string;
        })
        {
            if (!selectedJourney)
            {
                return;
            }

            // ======================================================
            // Journey -> Notes Bridge
            // Create the Notebook page that this session will own.
            // ======================================================

            const {
                page,
                block,
            } = createPage(selectedJourney.notebookId);

            const existingPages = loadPages();

            const updatedPages = [
    ...existingPages.filter(p => p.id !== page.id),
    page,
];
            
            setPages(updatedPages);
            savePages(updatedPages);


            setActivePageId(page.id);

            

            // ======================================================
            // Every page begins with its initial empty block.
            // ======================================================

            const existingBlocks = loadBlocks();

            const updatedBlocks = [
                ...existingBlocks,
                block,
            ];

            saveBlocks(updatedBlocks);

            // ======================================================
            // Update the Journey Notebook so it knows it owns
            // this new Session page.
            // ======================================================

            const notebooks = loadNotebooks();

            const updatedNotebooks =
                notebooks.map((notebook) =>
                {
                    if (notebook.id !== selectedJourney.notebookId)
                    {
                        return notebook;
                    }

                    return {
                        ...notebook,
                        pageIds: [
                            ...notebook.pageIds,
                            page.id,
                        ],
                    };
                });

            saveNotebooks(updatedNotebooks);

            // ======================================================
            // Session persistence comes next sprint.
            // For now we simply create the workspace.
            // ======================================================

            setShowSessionPopup(false);

        }

// ======================================================
// OPEN SESSION CREATION
// Browser requests a new Session.
// ======================================================
function handleCreateSession(journeyId: string)
{
    setSelectedJourneyId(journeyId);

    setShowSessionPopup(true);
}

    // ======================================================
    // RENDER
    // ======================================================
    return (
        <div
            style={{
                display: "flex",
                height: "100vh",
            }}
        >
            {/* ======================================================
                LEFT: JOURNEY BROWSER
                (mirrors NotebookBrowser structure intentionally)
            ====================================================== */}
            <JourneyBrowser
                journeys={journeys}
                pages={pages}
                selectedPageId={activePageId}
                selectedJourneyId={selectedJourneyId}

                onCreateJourney={handleCreateJourney}
                onSelectedJourney={handleSelectJourney}

                onSelectedPage={handleSelectPage}
                onCreateSession={handleCreateSession}
            />

            {/* ======================================================
                RIGHT: JOURNEY HOME
                This is NOT a session yet — just configuration view
            ====================================================== */}
            <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
    
    {/* ======================================================
        NO JOURNEY SELECTED
    ====================================================== */}
    {!selectedJourney && (
        <div style={{ opacity: 0.6, padding: "40px" }}>
            Select a Journey
        </div>
    )}

    {/* ======================================================
        JOURNEY CONFIG (before session)
    ====================================================== */}
    {selectedJourney && !activePageId && (
        <div style={{ padding: "40px", maxWidth: "700px" }}>
            
            <input
                value={selectedJourney.name}
                onChange={(e) => {
                    const updated = {
                        ...selectedJourney,
                        name: e.target.value,
                    };

                    const updatedJourneys = journeys.map(j =>
                        j.id === updated.id ? updated : j
                    );

                    setJourneys(updatedJourneys);
                    saveJourneys(updatedJourneys);
                }}
                placeholder="Journey Name"
                style={{ fontSize: "2rem", width: "100%" }}
            />

            <textarea
                value={selectedJourney.goal}
                onChange={(e) => {
                    const updated = {
                        ...selectedJourney,
                        goal: e.target.value,
                    };

                    setJourneys(prev =>
                        prev.map(j =>
                            j.id === updated.id ? updated : j
                        )
                    );
                }}
                placeholder="Goal"
                style={{ width: "100%", marginTop: "12px" }}
            />

            <button
                onClick={() => setShowSessionPopup(true)}
                style={{ marginTop: "20px" }}
            >
                Start Session
            </button>
        </div>
    )}

    {/* ======================================================
        🔥 THIS IS THE IMPORTANT PART
        JOURNEY SESSION = REAL NOTES ENGINE
    ====================================================== */}
    {selectedJourney && activePageId && (
    <NotesPage
        initialNotebookId={selectedJourney.notebookId}
        initialPageId={activePageId}
    />
)}

    {/* ======================================================
        SESSION POPUP
    ====================================================== */}
    {showSessionPopup && (
        <StartSessionPopup
            onClose={() => setShowSessionPopup(false)}
            onStart={handleStartSession}
        />
    )}
</main>
        </div>
    );
}