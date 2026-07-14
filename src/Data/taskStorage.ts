// ======================================================
// taskStorage.ts
// ------------------------------------------------------
// Central location for reading and writing task data.
//
// Every page (Focus, Planning, Recharge, Congruence,
// Dashboard, Task List) should use these functions
// instead of calling localStorage directly.
// ======================================================
import { sortTasksByDueDate } from "./taskSorting";
import type { Task } from "./tasks";

{/* Storage Key */}
const STORAGE_KEY = "tasks";

{/* Loads Tasks from localStorage */}
export function loadTasks(): Task[] {

    const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (!savedTasks) {
        return [];
    }

    const tasks: Task[] = JSON.parse(savedTasks);

    // ── Duplicate-id repair ─────────────────────────────────────────────
    // Edit/delete both match tasks by id, so two tasks sharing the same
    // id get edited or deleted together (and React key collisions make
    // edits look like they don't save). Older saved data could contain
    // duplicates from a since-fixed seeding bug — reassign any repeats
    // a fresh id here, once, so every task is safe to edit/delete on
    // its own from this point on.
    const seenIds = new Set<string>();
    let hadDuplicates = false;

    const repairedTasks = tasks.map((task) => {
        if (!task.id || seenIds.has(task.id)) {
            hadDuplicates = true;
            return { ...task, id: crypto.randomUUID() };
        }
        seenIds.add(task.id);
        return task;
    });

    if (hadDuplicates) {
        saveTasks(repairedTasks);
    }

    return repairedTasks;
}


{/* Saves task */}

export function saveTasks(tasks: Task[]): void 
{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}


{/* // Loads the current tasks,
// appends the new task,
// then saves everything.*/}

export function addTask(newTask: Task): void
{
    const tasks = loadTasks();
    tasks.push(newTask);
    saveTasks(tasks);
}

{/* / Update Task
// ------------------------------------------------------
// Finds a task by ID and replaces it.*/}

export function updateTask(updatedTask: Task): void
{
    const tasks = loadTasks();

    const updatedTasks = tasks.map( 
               task => task.id === updatedTask.id ? updatedTask : task
    );

    saveTasks(updatedTasks);
}

{/* Delete Task
// ------------------------------------------------------
// Removes a task by ID.*/}

export function deleteTask(taskId: string): void
{
    const tasks = loadTasks();

    const updatedTasks = tasks.filter(task => task.id !== taskId);

    saveTasks(updatedTasks);
}

{/* Clear All Tasks */}

export function clearTasks(): void
{
    localStorage.removeItem(STORAGE_KEY);
}

///helper functions

//get mood specfic task
export function getTasksByMood(mood: string): Task[]
{
    return loadTasks().filter(task => task.mood === mood);
}

//get number of mood specfic task
export function getTaskCountByMood( mood: string ): number
{
    return getTasksByMood(mood).length;
}

/**
 * Returns a new array sorted by due date.
 * Tasks without a due date are placed at the end.
 */




/**
 * Returns the top N upcoming tasks sorted by due date.
 * Defaults to the first task.
 */

export function getUpcomingTasks(
    task: Task[],
    count: number = 1,
    includeCompleted: boolean = false
): Task[] {

    const filtered = 
        includeCompleted ? task : task.filter(task => !task.completed);

        return sortTasksByDueDate(filtered).slice(0, count);
}

/**
 * Returns the title of the next upcoming task.
 * Returns a default message if no tasks exist.
 */

export function getUpcomingTaskTitle(
    task: Task[],
    ): string
    {
        const nextTask =  getUpcomingTasks(task,)[0];
        return nextTask ? nextTask.title : "No Upcomming Task";

    }


