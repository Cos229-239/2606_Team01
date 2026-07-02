import { useNotesPageFunctions } from "../Features/notes/editor/NotesPageFunctions";
import { useState } from "react";   
import NotebookBrowser from "../Features/notes/browser/NotebookBrowser";
import BlockList from "../Features/notes/editor/BlockList";
import CreateTaskPopup from "../Components/CreateTaskPopup"

export default function NotesPage()
{
   const {
    notebooks,
    pages,
    blocks,
    tasks,

    selectedNotebookId,
    focusedBlockId,
    showTaskPicker,

    setShowTaskPicker,

    selectedPage,

    handleCreateNotebook,
    handleSelectedNotebook,
    handleRenameNotebook,
    handleCreatePage,
    handleSelectedPage,
    handlePageTitleChange,
    handleUpdateBlock,
    handleCreateBlockAfter,
    handleDeleteBlock,
    handleDeletePage,
    handleDeleteNotebook,
    handleConvertBlock,

    // ==========================================
    // Task Actions
    // ==========================================

    handleEditTask,
    handleDeleteTask,

    handleCanvasClick,
    handleInsertTaskBlock,
    handleCreateTask,
} = useNotesPageFunctions();
    
const [showCreateTaskPopup, setShowCreateTaskPopup] = useState(false);
  
    return (
        <div
            style={{
                display: "flex",
                height: "100vh",
                backgroundColor: "rgba(20, 12, 55, 0.38)",
            }}
        >
            {/* ==========================================
                Notebook Sidebar
            ========================================== */}
            <NotebookBrowser
                notebooks={notebooks}
                pages={pages}
                selectedNotebookId={selectedNotebookId}
                onCreateNotebook={handleCreateNotebook}
                onSelectedNotebook={handleSelectedNotebook}
                onCreatePage={handleCreatePage}
                onSelectedPage={handleSelectedPage}
                onDeletePage={handleDeletePage}
                onDeleteNotebook={handleDeleteNotebook} 
                onRenameNotebook={handleRenameNotebook}
            />

            {/* ==========================================
                Document Workspace
            ========================================== */}
            <main style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    padding: "40px",
                    overflowY: "auto",
                }}
            >
                
            
                {selectedPage ? (
                    <div  style={{
                            width: "95%",
                            maxWidth: "100%",
                            backgroundColor: "rgba(20, 12, 55, 0.38)",
                            borderRadius: "10px",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                            padding: "48px",
                            minHeight: "900px",
                            boxSizing: "border-box",
                        }}
                    >
                        {/* Page Header */}
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

                        {/* Metadata */}
                        <p  style={{
                                color: "#777",
                                fontSize: ".9rem",
                                marginBottom: "24px",
                            }}
                        >
                            Last edited: Just now
                        </p>
                         <button onClick={() => setShowCreateTaskPopup(true)}>+ Create New Task</button>
                              
                        
                             {showCreateTaskPopup && (
                    <CreateTaskPopup
                        onClose={() => setShowCreateTaskPopup(false)}
                        onCreate={(task) => {
                            handleCreateTask(task); // or your create function
                            setShowCreateTaskPopup(false);
                        }}
                    />
                )}
                    <button
                        onClick={() => setShowTaskPicker(true)}
                        style={{
                            marginBottom: "24px",
                        }}
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
                                onClick={() =>
                                    setShowTaskPicker(false)
                                }
                                style={{
                                    marginTop: "12px",
                                }}
                            >
                                Close
                            </button>
                        </div>
                    )}

                    <hr
                        style={{
                            border: "none",
                            borderTop: "1px solid #e5e5e5",
                            marginBottom: "40px",
                        }}
                    />

                    <div style={{ minHeight: "600px" }}>
                        <div
                            onClick={handleCanvasClick}
                            style={{
                                minHeight: "600px",
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