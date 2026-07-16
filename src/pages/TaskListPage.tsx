import TaskCard from "../Components/TaskCard";
import { useEffect, useState } from "react";
import CreateTaskPopup from "../Components/CreateTaskPopup";
import EditTaskPopup from "../Components/EditTaskPopup";
import type { Task } from "../Data/tasks";
import { loadTasks, saveTasks } from "../Data/taskStorage";
import SortControl from "../Components/SortControl";
import type { SortDirection } from "../Components/SortControl";
import type { ChecklistItem } from "../Components/Checklist";
import
{
    sortTasksByTitle,
    sortTasksByDueDate,
    sortTasksByPriority,
    sortTasksByStatus,
    sortTasksByCompleted,
}
from "../Data/taskSorting";

export default function TaskListPage() {

  const [tasks, setTask] = useState<Task[]>(() => loadTasks());
    

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const [showCreateTaskPopup, setShowCreateTaskPopup] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [sortField, setSortField] =
    useState("dueDate");

  const [sortDirection, setSortDirection] =
      useState<SortDirection>("asc");

  const sortFieldOptions =
  [
      { value: "title", label: "Title" },
      { value: "dueDate", label: "Due Date" },
      { value: "priority", label: "Priority" },
      { value: "status", label: "Status" },
      { value: "completed", label: "Completed" },
  ];

  function getSortedTasks()
  {
      switch (sortField)
      {
          case "title":
              return sortTasksByTitle(tasks, sortDirection);

          case "priority":
              return sortTasksByPriority(tasks, sortDirection);

          case "status":
              return sortTasksByStatus(tasks, sortDirection);

          case "completed":
              return sortTasksByCompleted(tasks, sortDirection);

          case "dueDate":
          default:
              return sortTasksByDueDate(tasks, sortDirection);
      }
  }

  const sortedTasks =
      getSortedTasks();

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

  function handleChecklistChange(taskId: string, items: ChecklistItem[]) {
    setTask(prevTasks =>
      prevTasks.map(t => t.id === taskId ? { ...t, checklist: items } : t)
    );
  }

  return (
    <div>
      <div className="task-list-header">
    <h1>Task List</h1>

    <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={() => setShowCreateTaskPopup(true)}>
          + Create New Task</button>

        <SortControl
            fields={sortFieldOptions}
            currentField={sortField}
            currentDirection={sortDirection}
            onChange={(field, direction) =>
            {
                setSortField(field);
                setSortDirection(direction);
            }}
        />
    </div>
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
        {sortedTasks.map((task) =>
          <TaskCard key={task.id}
            {...task}
            onDelete={() => handleDeleteTask(task.id)}
            onEdit={() => setEditingTask(task)}
             onChecklistChange={(items) =>
                    handleChecklistChange(task.id, items)}
          />
        )}
      </div>
    </div>
  );
}
