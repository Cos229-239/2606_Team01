import type { Block } from "../types";
import type { Task } from "../../../Data/tasks";
import TaskCard from "../../../Components/TaskCard";
import EditTaskPopup from "../../../Components/EditTaskPopup";
import { useState } from "react";

interface Props {
    block: Block;
    tasks: Task[];

    onEditTask: (task: Task) => void;
    onDeleteTask: (id: string) => void;
}



export default function TaskBlock(
    { block, tasks,
      onEditTask, onDeleteTask,
     }: Props) {

    // Only render task blocks
   if (block.type !== "task") return null;

   
    // Controls whether the edit popup is open
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    
     // Find the task attached to this block
     const taskId: string  = block.content.taskId;

    const matchedTask = tasks.find(
        (storedTask) => storedTask.id === taskId
    );

    // Task was deleted but block still exists
    if (!matchedTask) {
        return (
            <div style={{ opacity: 0.6 }}>
                Task not found
            </div>
        );
    }
    

    return (
        <>

        <TaskCard
            {...matchedTask}
            onEdit={() => setEditingTask(matchedTask)}
            onDelete={() => onDeleteTask(matchedTask.id)}
        />

        {/* Edit Popup */}
        
        {editingTask && (
            <EditTaskPopup 
            task = {editingTask}
            onSave={(updatedTask) => 
                {
                    onEditTask(updatedTask);
                    setEditingTask(null);
                }}
            onClose ={() => setEditingTask(null)} />
        )}
        </>
    );
}