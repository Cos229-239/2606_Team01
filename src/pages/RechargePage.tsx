//Imports
import { useEffect, useState } from "react";
import TaskCard from "../Components/TaskCard";
import type { Task } from "../Data/tasks";
import EditTaskPopup from "../Components/EditTaskPopup";
import { addTask,updateTask, deleteTask, getTasksByMood } from "../Data/taskStorage";
import CreateTaskPopup from "../Components/CreateTaskPopup";


//This is where:components state rendering buttons activities will live.

export default function RechargePage() {

  
  const [showCreateTaskPopup, setShowCreateTaskPopup] = useState(false);
  const [rechargeTasks, setRechargeTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  // ======================================================
  //        Load Planning Task
  // ======================================================

  useEffect(() => {
    setRechargeTasks(getTasksByMood("Recharge"));
  }, []);

 
   function refreshTasks() {
   setRechargeTasks(getTasksByMood("Recharge"));
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
  //rendering
  return (
    <div>
      <h1>Recharge Page</h1>

      <p>This is where we Take a moment, brethe and grow from what
        we've learned.</p>

      <hr />

      <h2>Recharge Tasks</h2>

      <button onClick={() => setShowCreateTaskPopup(true)}>+ Create New Task</button>
                  
            
                  {showCreateTaskPopup &&
                    <CreateTaskPopup onCreate={handleCreateTask}
                      onClose={() => setShowCreateTaskPopup(false)} />
                  }

      {/*if no focused task show   */}
      {rechargeTasks.length  == 0 ? (
        <p>No Recharge Task Avaliable.</p>
      ) : (
        //else show this
        rechargeTasks.map((task) => (
          <TaskCard key={task.id}
            {...task}
            onEdit={() => setEditingTask(task)}
            onDelete={() => handleDeleteTask(task.id)}
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
              onClose={() =>
                  setEditingTask(null)
              }
          />
      )}
    </div>
  );
}
