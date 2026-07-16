// ======================================================
// BlockList.tsx
// ------------------------------------------------------
// Renders all blocks belonging to a page.
//
// Responsibilities:
// - Render blocks in page order
// - Pass editor callbacks downward
// - Act as the document rendering layer
// ======================================================

import type { Page, Block, BlockType } from "../types";
import BlockRenderer from "./BlockRenderer";
import type { Task } from "../../../Data/tasks";

interface BlockListProps {
    page: Page;
    blocks: Block[];
    tasks: Task[];

      // Block callbacks
    onUpdateBlock: (blockId: string, content: any) => void;
    onCreateBlockAfter: (  blockId: string   ) => void;
    onDeleteBlock: ( blockId: string ) => void,
    onConvertBlock: (  blockId: string, type: BlockType, 
        content: any ) => void;

    // Task callbacks
    // Forwarded to TaskBlock through BlockRenderer.
    onEditTask: (task: Task) => void;
    onDeleteTask: (id: string) => void;

    focusedBlockId: string | null;
}


export default function BlockList({
    page,
    blocks,
    tasks,
    onUpdateBlock,
    onCreateBlockAfter,
    onDeleteBlock,
    onConvertBlock,
    onEditTask,
    onDeleteTask,
    focusedBlockId,
        }: BlockListProps) {
    if (!page) return null;

   
    // ==================================================
    // Render blocks using page.blockIds order
    // ==================================================

    const pageBlocks = page.blockIds
        .map((blockId) =>
            blocks.find(
                (block) => block.id === blockId
            )
        )
        .filter(
            (block): block is Block =>
                block !== undefined
        );

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
            }}
        >
            {pageBlocks.map((block) => (
                <BlockRenderer
                    key={block.id}
                    block={block}
                    tasks ={tasks}
                    onUpdateBlock={onUpdateBlock}
                    onCreateBlockAfter={   onCreateBlockAfter   }
                    onDeleteBlock={onDeleteBlock}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                    onConvertBlock={onConvertBlock}
                    focused={  block.id === focusedBlockId }

                />
            ))}
        </div>
    );
}