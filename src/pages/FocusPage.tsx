//Imports
import { useEffect, useState } from "react";
import { statesData } from "../statesData";
import ActivityPage from "../pages/ActivityPage";
import TaskCard from "../Components/TaskCard";
import type { Task } from "../Data/tasks";
import { getTaskCountByMood, getTasksByMood } from "../Data/taskStorage";

//This is where:components state rendering buttons activities will live.

export default function FocusPage() {

  const focusedState = statesData.focused;
  const [selectedFocus, setSelectedFocus] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [focusedTasks, setFocusedTasks] = useState<Task[]>([]);

  // ======================================================
  // Load Focused Tasks
  // ======================================================

  useEffect(() => {
    setFocusedTasks(getTasksByMood("Focused"));
  }, []);

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

          {/*if no focused task show   */}
          {getTaskCountByMood("Focused") == 0 ? (
            <p>No Focused Task Avaliable.</p>
          ) : (
            //else show this
            focusedTasks.map((task) => (
              <TaskCard key={task.id}
                {...task}
                onDelete={() => { }}
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
    </div>
  );
}
