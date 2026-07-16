import { useState } from "react";
import { useSmoothScroll } from "../Data/useSmoothScroll";

type TaskCardProps = {
  id: string;
  title: string;
  notes: string;
  completed: boolean;
  mood: string;
  priority: string;
  dueDate: string;
  updatedAt: string;

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
  onDelete,
  onEdit,
}: TaskCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const smoothScroll = useSmoothScroll();
  const lines = notes.split("\n");
  const preview = lines.slice(0, 2);

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

      {/* Collapsed preview fades out as the full notes open, rather than the
          two swapping instantly -- same accordion-body pattern used by
          AccordionPreview/DashboardAccordion, gated by the smooth scrolling
          setting. */}
      <div className={`accordion-body ${isOpen ? "" : "open"} ${smoothScroll ? "" : "no-motion"}`}>
        <div className="accordion-body-inner">
          {preview.map((line, index) => (
            <p key={index} className="task-note-line">{line}</p>
          ))}
        </div>
      </div>

      <div className={`accordion-body ${isOpen ? "open" : ""} ${smoothScroll ? "" : "no-motion"}`}>
        <div className="accordion-body-inner">
          {lines.map((line, index) => (
            <p key={index} className="task-note-line">{line}</p>
          ))}

          <div className="task-updated">
            Updated: {updatedAt}
            <button onClick={onEdit} style={{ marginLeft: "10px" }}>Edit Task</button>
            <button onClick={onDelete} style={{ marginLeft: "8px" }}>Delete Task</button>
          </div>
        </div>
      </div>
    </div>
  );
}
