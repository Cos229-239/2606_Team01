import { useEffect, useState } from "react";
import { useNotesPageFunctions } from "../Features/notes/editor/NotesPageFunctions";

import type { Journey } from "../Features/journey/types";

import {
    loadJourneys,
    saveJourneys,
} from "../Features/journey/Storage/journeyStorage";

import { createJourney } from "../Features/journey/Utils/JourneyFactory";

import JourneyBrowser from "../Features/journey/Browser/JourneyBrowser";

import StartSessionPopup from "../Features/journey/Session/StartSessionPopup";

import CreateTaskPopup from "../Components/CreateTaskPopup";

import BlockList from "../Features/notes/editor/BlockList";

import {
    createPage,
} from "../Features/notes/utils/NotesFactory";

import {
    loadPages,
    savePages,
    loadBlocks,
    saveBlocks,
    loadNotebooks,
    saveNotebooks,
} from "../Features/notes/storage/notebookStorage";


export default function JourneyPage()
{
    // ======================================================
    // JOURNEY STATE
    // ======================================================
    const [journeys, setJourneys] = useState<Journey[]>([]);
    const [selectedJourneyId, setSelectedJourneyId] =
        useState<string | null>(null);

    const [selectedPageId, setSelectedPageId] =
    useState<string | null>(null);    
    
    const [startSessionPopup, setShowSessionPopup] =
        useState(false);

    
    // Derived selected journey
    const selectedJourney =
        journeys.find((j) => j.id === selectedJourneyId);


   const {
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
    handleCanvasClick,
    handleInsertTaskBlock,
    handleCreateTask,
    handleEditTask,
    handleDeleteTask,
} = useNotesPageFunctions({
    selectedPageId,
})


   const selectedPage = pages.find(
    (page) =>
        page.id === selectedPageId &&
        selectedJourney?.notebookId === page.notebookId
);


    // ======================================================
    // LOAD JOURNEYS ON MOUNT
    // ======================================================
    useEffect(() =>
    {
        const loadedJourneys = loadJourneys();
        setJourneys(loadedJourneys);
    }, []);

    function handleCreateJourney() {
    const { journey } = createJourney();

    const updated = [...journeys, journey];

    setJourneys(updated);

    saveJourneys(updated);

    setSelectedJourneyId(journey.id);
}

function handleSelectJourney(journeyId: string) {
    setSelectedJourneyId(journeyId);

    setSelectedPageId(null);
}

function handleCreateSession(journeyId: string) {
    setSelectedJourneyId(journeyId);

    setShowSessionPopup(true);
}

function handleSelectPage(pageId: string)
{
    setSelectedPageId(pageId);
}


    // ======================================================
    // RENDER
    // ======================================================
    

          return (
                 <div
                     style={{
                         display: "flex",
                         height: "100vh",
                         backgroundColor: "rgba(20, 12, 55, 0.38)",
                     }}
                 >
                    
            {/* ======================================================
                LEFT: JOURNEY BROWSER
                (mirrors NotebookBrowser structure intentionally)
            ====================================================== */}
            <JourneyBrowser
                journeys={journeys}
                pages={pages}
                selectedPageId={selectedPageId}
                selectedJourneyId={selectedJourneyId}

                onCreateJourney={handleCreateJourney}
                onSelectedJourney={handleSelectJourney}

                onSelectedPage={handleSelectPage}
                onCreateSession={handleCreateSession}
            />
         
                     {/* ================= MAIN EDITOR ================= */}
                     <main
                         style={{
                             flex: 1,
                             display: "flex",
                             justifyContent: "center",
                             padding: "40px",
                             overflowY: "auto",
                         }}
                     >
                         {selectedPage ? (
                             <div
                                 style={{
                                     width: "95%",
                                     maxWidth: "100%",
                                     backgroundColor: "rgba(20, 12, 55, 0.38)",
                                     borderRadius: "10px",
                                     padding: "48px",
                                     minHeight: "900px",
                                 }}
                             >
                                 {/* PAGE TITLE */}
                                 <input
                                     type="text"
                                     value={selectedPage?.title ?? ""}
                                     onChange={(e) =>
                                         handlePageTitleChange(e.target.value)
                                     }
                                     placeholder="Untitled Page"
                                     style={{
                                         width: "100%",
                                         fontSize: "2.5rem",
                                         fontWeight: "bold",
                                         border: "none",
                                         outline: "none",
                                         background: "transparent",
                                         marginBottom: "12px",
                                     }}
                                 />
         
                                 {/* META */}
                                 <p style={{ color: "#777", marginBottom: "24px" }}>
                                     Last edited: Just now
                                 </p>
         
                               
         
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
         
                                 <hr style={{ margin: "40px 0" }} />
         
                                 {/* BLOCK EDITOR */}
                                 <div onClick={handleCanvasClick}>
                                     <BlockList
                                         page={selectedPage}
                                         blocks={blocks}
                                         tasks={tasks}
                                         onUpdateBlock={handleUpdateBlock}
                                         onConvertBlock={handleConvertBlock}
                                         onCreateBlockAfter={handleCreateBlockAfter}
                                         onDeleteBlock={handleDeleteBlock}
                                         onEditTask={handleEditTask}
                                         onDeleteTask={handleDeleteTask}
                                         focusedBlockId={focusedBlockId}
                                     />
                                 </div>
                             </div>
                         ) : (
                             <div
                                 style={{
                                     display: "flex",
                                     justifyContent: "center",
                                     alignItems: "center",
                                     width: "100%",
                                     color: "#777",
                                     fontSize: "1.2rem",
                                 }}
                             >
                                 Select or create a page to begin writing.
                             </div>
                         )}
                     </main>
                 </div>
             );
         }