//Imports
import { useEffect, useState } from "react";
import TaskCard from "../Components/TaskCard";
import type { Task } from "../Data/tasks";
import type { ChecklistItem } from "../Components/Checklist";
import { deleteTask, getTasksByMood} from "../Data/taskStorage";
import EditTaskPopup from "../Components/EditTaskPopup";
import  { addTask, updateTask } from "../Data/taskStorage";
import CreateTaskPopup from "../Components/CreateTaskPopup";

//This is where:components state rendering buttons activities will live.

export default function PlanningPage() {

  
  const [showCreateTaskPopup, setShowCreateTaskPopup] = useState(false);
  const [planningTasks, setPlanningTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // ======================================================
  //        Load Planning Task
  // ======================================================

  useEffect(() => {
    refreshTasks();
  }, []);


  function refreshTasks() {
  setPlanningTasks(getTasksByMood("Planning"));
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

function handleChecklistChange(taskId: string, items: ChecklistItem[]) {
  const targetTask = planningTasks.find((task) => task.id === taskId);

  if (!targetTask) {
    return;
  }

  const updatedTask: Task = {
    ...targetTask,
    checklist: items,
  };

  updateTask(updatedTask);
  refreshTasks();
}

  //rendering
  return (
    <div>
      <h1>Planning Page</h1>

      <p>This is where we anticipate challenges,
        organize our work, and stack our hand for execution.</p>

      <hr />

      <h2>Planning Tasks</h2>

      <button onClick={() => setShowCreateTaskPopup(true)}>+ Create New Task</button>
            
      
            {showCreateTaskPopup &&
              <CreateTaskPopup onCreate={handleCreateTask}
                onClose={() => setShowCreateTaskPopup(false)} />
            }

      {/*if no focused task show   */}
      {planningTasks.length == 0 ? (
        <p>No Planning Task Avaliable.</p>
      ) : (
        //else show this
        planningTasks.map((task) => (
          <TaskCard key={task.id}
            {...task}
            onEdit={() => setEditingTask(task)}
            onDelete={() => handleDeleteTask(task.id)}
            onChecklistChange={(items) => handleChecklistChange(task.id, items)}
          />
        ))
      )}
       {editingTask && (
                <EditTaskPopup
                    task={editingTask}
                    onSave={(updatedTask) =>
                    {
                        handleEditTask(updatedTask);
                        setEditingTask(null);
                    }}
                    onClose={() => {
                        setEditingTask(null);
                        refreshTasks();
                    }}
                />
            )}
    </div>
    
  );
}
