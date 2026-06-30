import type { Block } from "../types";
import type { Task } from "../../../Data/tasks";

import EmptyBlock from "../blocks/EmptyBlock";
import TextBlock from "../blocks/TextBlock";
import HeadingBlock from "../blocks/HeadingBlock";
import ListBlock from "../blocks/ListBlock";
import DividerBlock from "../blocks/DividerBlock";
import TaskBlock from "../blocks/TaskBlock";

interface BlockRendererProps {
    block: Block;
    tasks: Task[];
    onUpdateBlock: ( blockId: string, content: string) => void;
    onCreateBlockAfter: (  blockId: string  ) => void;
    onDeleteBlock: ( blockId: string ) => void,

    // Task callbacks
    // Passed straight through to TaskBlock.
    // BlockRenderer does not use them itself.
    onEditTask: (task: Task) => void;
    onDeleteTask: (id: string) => void;
    focused?: boolean;
}

/**
 * BlockRenderer
 * ------------------------------------------------------
 * Responsibility:
 * - Choose correct block component
 * - Forward update handler
 */
export default function BlockRenderer({
    block,
    tasks,
    onUpdateBlock,
    onCreateBlockAfter,
    onDeleteBlock,
    onEditTask,
    onDeleteTask,
    focused,
}: BlockRendererProps) {
    switch (block.type) {
        case "empty":
            return (
                <EmptyBlock
                    block={block}
                    onUpdateBlock={onUpdateBlock}
                    onCreateBlockAfter={  onCreateBlockAfter }
                    onDeleteBlock={ onDeleteBlock}
                    focused={focused}              />
            );

        case "text":
            return <TextBlock block={block} />;

        case "heading":
            return <HeadingBlock block={block} />;

        case "list":
            return <ListBlock block={block} />;

        case "divider":
            return <DividerBlock block={block} />;

        case "task":
            return <TaskBlock block={block}
                    tasks ={tasks}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask} />;

        default:
            return null;
    }
}