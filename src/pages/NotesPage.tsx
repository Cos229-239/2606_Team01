import { useNotesPageFunctions } from "../Features/notes/editor/NotesPageFunctions";
import { useState } from "react";
import NotebookBrowser from "../Features/notes/browser/NotebookBrowser";
import BlockList from "../Features/notes/editor/BlockList";
import CreateTaskPopup from "../Components/CreateTaskPopup";

interface NotesPageProps {
    initialNotebookId?: string;
    initialPageId?: string;
}

export default function NotesPage({
    initialNotebookId: _initialNotebookId,
    initialPageId: _initialPageId,
}: NotesPageProps) 
{
    const [selectedPageId, setSelectedPageId] =
        useState<string | null>(null);

    const [showCreateTaskPopup, setShowCreateTaskPopup] =
        useState(false);

const {
    notebooks,
    pages,
    blocks,
    tasks,

    selectedNotebookId,
    focusedBlockId,
    showTaskPicker,

    setShowTaskPicker,

    handleCreateNotebook,
    handleSelectedNotebook,
    handleRenameNotebook,
    handleCreatePage,
    handlePageTitleChange,
    handleUpdateBlock,
    handleCreateBlockAfter,
    handleDeleteBlock,
    handleDeletePage,
    handleDeleteNotebook,
    handleConvertBlock,

    handleEditTask,
    handleDeleteTask,

    handleCanvasClick,
    handleInsertTaskBlock,
    handleCreateTask,
} = useNotesPageFunctions({
    selectedPageId,
});



const selectedPage =
    pages.find((page) => page.id === selectedPageId);

    

    return (
        <div
            style={{
                display: "flex",
                height: "100%",
                minHeight: 0,
                backgroundColor: "rgba(20, 12, 55, 0.38)",
            }}
        >
            {/* ================= SIDEBAR ================= */}
            <NotebookBrowser
                notebooks={notebooks}
                pages={pages}
                selectedNotebookId={selectedNotebookId}
                onCreateNotebook={handleCreateNotebook}
                onSelectedNotebook={handleSelectedNotebook}
                onCreatePage={handleCreatePage}
                onSelectedPage={setSelectedPageId}
                onDeletePage={handleDeletePage}
                onDeleteNotebook={handleDeleteNotebook}
                onRenameNotebook={handleRenameNotebook}
            />

            {/* ================= MAIN EDITOR ================= */}
            <main
                style={{
                    flex: 1,
                    minWidth: 0,
                    minHeight: 0,
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
                            display: "flex",
                            flexDirection: "column",
                            alignSelf: "flex-start",
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

                            
                     <div
                            style={{
                                display:"flex",
                                gap:"10px",
                                marginTop:"20px",
                            }}
                        >
                        {/* TASK CREATION */}
                        <button
                            onClick={() => setShowCreateTaskPopup(true)}
                            style={{ alignSelf: "flex-start" }}
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
                            style={{ alignSelf: "flex-start", marginBottom: "24px" }}
                        >
                            + Add Task Block
                        </button>
                        </div>
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
                        <div
                            onClick={handleCanvasClick}
                            style={{
                                flex: 1,
                                width: "100%",
                                minHeight: "600px",
                                paddingBottom: "260px",
                                cursor: "text",
                            }}
                        >
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