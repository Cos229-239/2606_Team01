//Imports
import { useEffect, useState } from "react";
import { statesData } from "../statesData";
import ActivityPage from "../pages/ActivityPage";
import TaskCard from "../Components/TaskCard";
import type { Task } from "../Data/tasks";
import EditTaskPopup from "../Components/EditTaskPopup";
import {addTask, deleteTask, updateTask, getTasksByMood } from "../Data/taskStorage";
import CreateTaskPopup from "../Components/CreateTaskPopup";

//This is where:components state rendering buttons activities will live.

export default function FocusPage() {

  const focusedState = statesData.focused;
  
  const [showCreateTaskPopup, setShowCreateTaskPopup] = useState(false);
  const [selectedFocus, setSelectedFocus] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [focusedTasks, setFocusedTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // ======================================================
  // Load Focused Tasks
  // ======================================================

  useEffect(() => {
    refreshTasks();
  }, []);

  function refreshTasks() {
  setFocusedTasks(getTasksByMood("Focused"));
}


  function handleEditTask(updatedTask: Task) {
  updateTask(updatedTask);
  refreshTasks();
}

    function handleDeleteTask(taskId: string) {

  deleteTask(taskId);
  refreshTasks();
}

function handleCreateTask(newTask: Task) {
    addTask(newTask);
    refreshTasks();
    setShowCreateTaskPopup(false);
}

  let currentActivities: string[] = [];

  //switch for activities
  switch (selectedFocus) {
    case "Momentum Builder":
      currentActivities = focusedState.activities.momentumBuilder;
      break;
    case "Light Focus":
      currentActivities = focusedState.activities.lightFocus;
      break;
    case "Deep Focus":
      currentActivities = focusedState.activities.deepFocus;
      break;
  }

  //rendering
  return (
    <div>
      {/* if no activity is selected show focus/activity section */}
      {!selectedActivity && (
        <>
          <h1>{focusedState.name}</h1>

          <ul className="identity-list">
            {focusedState.identity.map((statement) => (
              <li key={statement}>{statement}</li>
            ))}
          </ul>

          <hr />
          {/* ======================================================
                    Focused Tasks
                ====================================================== */}

          <h2>Focused Tasks</h2>

          <button onClick={() => setShowCreateTaskPopup(true)}>+ Create New Task</button>
                      
                
                      {showCreateTaskPopup &&
                        <CreateTaskPopup onCreate={handleCreateTask}
                          onClose={() => setShowCreateTaskPopup(false)} />
                      }

          {/*if no focused task show   */}
          { focusedTasks.length == 0 ? (
            <p>No Focused Task Avaliable.</p>
          ) : (
            //else show this
            focusedTasks.map((task) => (
              <TaskCard key={task.id}
                {...task}
                onEdit={() => setEditingTask(task)}
                onDelete={() => handleDeleteTask(task.id)}
              />
            ))
          )}

          {/* focus modes   */}
          <div className="section-heading">What would you like to do?</div>
          <div className="focus-mode-row">
            <button onClick={() => setSelectedFocus("Momentum Builder")}>Momentum Builder</button>
            <button onClick={() => setSelectedFocus("Light Focus")}>Light Focus</button>
            <button onClick={() => setSelectedFocus("Deep Focus")}>Deep Focus</button>
          </div>

          {selectedFocus && (
            <>
              <div className="section-heading">{selectedFocus}</div>
              {/* show all activities  */}
              <div className="activity-list">
                {currentActivities.map((activity) => (
                  <button key={activity}
                    className="activity-btn"
                    onClick={() => setSelectedActivity(activity)}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* if an activity is selected show activity page */}
      {selectedActivity && (
        <ActivityPage activityName={selectedActivity} />
      )}

       {editingTask && (
                <EditTaskPopup
                    task={editingTask}
                    onSave={(updatedTask) =>
                    {
                        handleEditTask(updatedTask);
                        setEditingTask(null);
                    }}
                    onClose={() =>
                        setEditingTask(null)
                    }
                />
            )}
    </div>
  );
}
