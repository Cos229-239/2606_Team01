import type { Block } from "../types";
import type { Task } from "../../../Data/tasks";
import TaskCard from "../../../Components/TaskCard";

interface Props {
    block: Block;
    tasks: Task[];
}

export default function TaskBlock({ block, tasks }: Props) {
   if (block.type !== "task") return null;

    const taskId: string  = block.content.taskId;

    const matchedTask = tasks.find(
        (storedTask) => storedTask.id === taskId
    );

    if (!matchedTask) {
        return (
            <div style={{ opacity: 0.6 }}>
                Task not found
            </div>
        );
    }

    return (
        <TaskCard
            {...matchedTask}
            onDelete={() => {}}
        />
    );
}