import { useState } from "react";
import CheckList from "./Checklist";
import type { ChecklistItem } from "./Checklist";

type TaskCardProps = {
  id: string;
  title: string;
  notes: string;
  completed: boolean;
  mood: string;
  priority: string;
  dueDate: string;
  updatedAt: string;

checklist: ChecklistItem[];
onChecklistChange: (items: ChecklistItem[]) => void;


  onDelete: () => void;
  onEdit: () => void;
};

export default function TaskCard({
  title,
  notes,
  completed,
  mood,
  priority,
  dueDate,
  updatedAt,
  checklist,
  onChecklistChange,
  onDelete,
  onEdit,
}: TaskCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const lines = notes.split("\n");

  return (
    <div className="glass-panel task-card">
      <div
        className="task-card-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="task-chip">
          <strong>Due</strong> {dueDate}
        </span>
        <span className="task-chip">
          <strong>Title</strong> {title}
        </span>
        <span className={`task-chip ${completed ? "task-status-done" : "task-status-active"}`}>
          <strong>Status</strong> {completed ? "Done" : "Active"}
        </span>
        <span className="task-chip">
          <strong>Mood</strong> {mood}
        </span>
        <span className="task-chip">
          <strong>Priority</strong> {priority}
        </span>
      </div>

       <div
        onClick={(event) => event.stopPropagation()}
        style={{ marginTop: "10px" }}
      >
        <CheckList
          items={checklist}
          onItemsChange={onChecklistChange}
        />
      </div>

      {isOpen &&(
        <>
       {lines.map((line, index) => (
          <p key={index} className="task-note-line">{line}</p>
        ))}


        <div className="task-updated">
          Updated: {updatedAt}
          <button onClick={onEdit} style={{ marginLeft: "10px" }}>Edit Task</button>
          <button onClick={onDelete} style={{ marginLeft: "8px" }}>Delete Task</button>
        </div>

        </>
      )}
    </div>
  );
}
