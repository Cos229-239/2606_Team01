import type { Task } from "./tasks";


export type SortDirection = "asc" | "desc";

const PRIORITY_RANK: Record<string, number> =
{
    Low: 0,
    Medium: 1,
    High: 2,
};

// ======================================================
// BY TITLE
// ======================================================

export function sortTasksByTitle(
    tasks: Task[],
    direction: SortDirection = "asc"
): Task[]
{
    const sorted =
        [...tasks].sort(
            (a, b) =>
                a.title.localeCompare(b.title)
        );

    return direction === "asc" ? sorted : sorted.reverse();
}

// ======================================================
// BY DUE DATE
// ======================================================
// Moved from taskStorage.ts — this is now the single
// source of truth for due-date sorting. Tasks without a
// due date always sink to the end, regardless of direction.

export function sortTasksByDueDate(
    tasks: Task[],
    direction: SortDirection = "asc"
): Task[]
{
    const withDate =
        tasks.filter((task) => task.dueDate);

    const withoutDate =
        tasks.filter((task) => !task.dueDate);

    const sorted =
        [...withDate].sort(
            (a, b) =>
                new Date(a.dueDate).getTime() -
                new Date(b.dueDate).getTime()
        );

    const ordered =
        direction === "asc" ? sorted : sorted.reverse();

    return [...ordered, ...withoutDate];
}

// ======================================================
// BY PRIORITY
// ======================================================

export function sortTasksByPriority(
    tasks: Task[],
    direction: SortDirection = "asc"
): Task[]
{
    const sorted =
        [...tasks].sort(
            (a, b) =>
                (PRIORITY_RANK[a.priority] ?? -1) -
                (PRIORITY_RANK[b.priority] ?? -1)
        );

    return direction === "asc" ? sorted : sorted.reverse();
}

// ======================================================
// BY STATUS
// ======================================================
// Only rule defined so far: "Not Started" tasks come first.
// Everything else isn't ranked against each other by status
// yet — they fall back to due-date order as a tiebreaker,
// reusing sortTasksByDueDate rather than re-sorting.

export function sortTasksByStatus(
    tasks: Task[],
    direction: SortDirection = "asc"
): Task[]
{
    const notStarted =
        tasks.filter((task) => task.status === "Not Started");

    const rest =
        tasks.filter((task) => task.status !== "Not Started");

    const restByDueDate =
        sortTasksByDueDate(rest, "asc");

    const ordered =
        [...notStarted, ...restByDueDate];

    return direction === "asc" ? ordered : ordered.reverse();
}

// ======================================================
// BY COMPLETED
// ======================================================

export function sortTasksByCompleted(
    tasks: Task[],
    direction: SortDirection = "asc"
): Task[]
{
    const sorted =
        [...tasks].sort(
            (a, b) =>
                Number(a.completed) - Number(b.completed)
        );

    return direction === "asc" ? sorted : sorted.reverse();
}