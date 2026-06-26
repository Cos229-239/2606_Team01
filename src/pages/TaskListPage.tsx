import TaskCard from "../Components/TaskCard";
import { useEffect, useState } from "react";
import CreateTaskPopup from "../Components/CreateTaskPopup";
import EditTaskPopup from "../Components/EditTaskPopup";
import { defaultTask } from "../Data/tasks";
import type { Task } from "../Data/tasks";
import { loadTasks, saveTasks } from "../Data/taskStorage";

export default function TaskListPage() {

  const [tasks, setTask] = useState<Task[]>(() => {
    const savedTasks = loadTasks();
    if (savedTasks.length > 0) {
      return savedTasks;
    }
    return defaultTask;
  });

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const [showCreateTaskPopup, setShowCreateTaskPopup] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  function handleCreateTask(newTask: Task) {
    setTask((prevTasks) => [newTask, ...prevTasks]);
    setShowCreateTaskPopup(false);
  }

  {/* Function to create new task  */}
  function handleDeleteTask(taskId: string) {

    //refresh {age
    setTask(prevTask =>
      prevTask.filter(task => task.id !== taskId));
  }

  function handleEditTask(updated: Task) {
    setTask(prevTasks =>
      prevTasks.map(t => t.id === updated.id ? updated : t)
    );
    setEditingTask(null);
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

      {editingTask &&
        <EditTaskPopup
          task={editingTask}
          onSave={handleEditTask}
          onClose={() => setEditingTask(null)}
        />
      }

      <div className="section-heading">All Tasks</div>
      <div>
        {tasks.map((task) =>
          <TaskCard key={task.id}
            {...task}
            onDelete={() => handleDeleteTask(task.id)}
            onEdit={() => setEditingTask(task)}
          />
        )}
      </div>
    </div>
  );
}
