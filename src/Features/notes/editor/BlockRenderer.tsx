import type { Block, BlockType } from "../types";
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
    onConvertBlock: (  blockId: string, type: BlockType, 
            content: any ) => void;

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
    onConvertBlock,
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
                    focused={focused}
                    onConvertBlock={onConvertBlock}
                />
            );

        case "text":
            return <TextBlock block={block}
                    onUpdateBlock={onUpdateBlock}
                    onConvertBlock={onConvertBlock}
                    onCreateBlockAfter={onCreateBlockAfter}
                    onDeleteBlock={onDeleteBlock}
                    focused={focused}
                />;

        case "heading":
            return <HeadingBlock block={block} />;

        case "list":
            return <ListBlock block={block} 
                    onUpdateBlock={onUpdateBlock}
                    onConvertBlock={onConvertBlock}
                    onCreateBlockAfter={onCreateBlockAfter}
                    onDeleteBlock={onDeleteBlock}
                    focused={focused}/>;

        case "divider":
            return <DividerBlock block={block} />;

        case "task":
            return <TaskBlock block={block}
                    tasks ={tasks}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                    onDeleteBlock={onDeleteBlock} />;

        default:
            return null;
    }
}