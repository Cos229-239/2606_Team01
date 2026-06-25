import TaskCard from "../Components/TaskCard";
import { useEffect, useState } from "react";
import CreateTaskPopup from "../Components/CreateTaskPopup";
import { defaultTask } from "../Data/tasks";
import type { Task } from "../Data/tasks";
import { loadTasks, saveTasks } from "../Data/taskStorage";

export default function TaskListPage() {

  {/* Function to create new task  */}
  const [tasks, setTask] = useState<Task[]>(() => {
    const savedTasks = loadTasks();

    if (savedTasks.length > 0) {
      return (savedTasks);
    }

    return defaultTask;
  });

  // ======================================================
  // Save Tasks Whenever They Change
  //
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  {/* Function to display tack creation pop up */}
  const [showCreateTaskPopup, setShowCreateTaskPopup] = useState(false);

  {/* Function handler for task creation */}
  function handleCreateTask(newTask: Task) {

    {/* Overrides array with new array of task */}
    setTask((prevTasks) => [newTask, ...prevTasks]);

    {/* hides pop up */}
    setShowCreateTaskPopup(false);
  }

  {/* Function to create new task  */}
  function handleDeleteTask(taskId: string) {

    //refresh {age
    setTask(prevTask =>
      prevTask.filter(task => task.id !== taskId));
  }

  return (
    <div>
      <div className="task-list-header">
        <h1>Task List</h1>
        <button onClick={() => setShowCreateTaskPopup(true)}>+ Create New Task</button>
      </div>

      {showCreateTaskPopup &&
        <CreateTaskPopup onCreate={handleCreateTask}
          onClose={() => setShowCreateTaskPopup(false)} />
      }

      <div className="section-heading">All Tasks</div>
      <div>
        {tasks.map((task) =>
          <TaskCard key={task.id}
            {...task}
            onDelete={() => handleDeleteTask(task.id)}
          />
        )}
      </div>
    </div>
  );
}
