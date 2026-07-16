import type { ChecklistItem } from "../Components/Checklist";

export type Task = {

    id: string;
    title: string;
    notes: string;
    completed: boolean;
    mood: string;
    status: string;
    priority: string;
    dueDate: string;
    updatedAt: string;
    checklist: ChecklistItem[];
};



