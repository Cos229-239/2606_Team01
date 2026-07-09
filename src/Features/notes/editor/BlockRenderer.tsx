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
 * - Forward editor callbacks
 * - Mark the rendered block so the editor canvas can
 *   distinguish between clicking a block and clicking
 *   empty canvas.
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
                <div data-block>
                <EmptyBlock
                    block={block}
                    onUpdateBlock={onUpdateBlock}
                    onCreateBlockAfter={  onCreateBlockAfter }
                    onDeleteBlock={ onDeleteBlock}
                    focused={focused}
                    onConvertBlock={onConvertBlock}
                />
                </div>
            );

        case "text":
            return (
            <div data-block>
                <TextBlock block={block}
                    onUpdateBlock={onUpdateBlock}
                    onConvertBlock={onConvertBlock}
                    onCreateBlockAfter={onCreateBlockAfter}
                    onDeleteBlock={onDeleteBlock}
                    focused={focused}
                />
                </div>
            );

        case "heading":
            return (
            <div data-block>
                <HeadingBlock block={block}
                    onUpdateBlock={onUpdateBlock}
                    onConvertBlock={onConvertBlock}
                    onCreateBlockAfter={onCreateBlockAfter}
                    onDeleteBlock={onDeleteBlock}
                    focused={focused} />
            </div>
            );

        case "list":
            return   (
            <div data-block>
               <ListBlock block={block} 
                    onUpdateBlock={onUpdateBlock}
                    onConvertBlock={onConvertBlock}
                    onCreateBlockAfter={onCreateBlockAfter}
                    onDeleteBlock={onDeleteBlock}
                    focused={focused}/>
                    </div>
            );

        case "divider":

            return (
            <div data-block> 
            <DividerBlock block={block} onDeleteBlock={onDeleteBlock} />
            </div>
            );

        case "task":
            return (
            <div data-block>
                <TaskBlock block={block}
                    tasks ={tasks}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                    onDeleteBlock={onDeleteBlock} />
                    </div>
            );

        default:
            return null;
        }}