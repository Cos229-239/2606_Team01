import type { Block } from "../types";

interface Props {
    block: Block;
}

export default function TaskBlock({ block }: Props) {
    return (
        <div>
            Task: {block.type === "task" ? block.content.taskId : ""}
        </div>
    );
}