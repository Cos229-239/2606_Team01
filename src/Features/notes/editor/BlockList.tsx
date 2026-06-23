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

import type { Page, Block } from "../types";
import BlockRenderer from "./BlockRenderer";

interface BlockListProps {
    page: Page;
    blocks: Block[];
    onUpdateBlock: (blockId: string, content: string) => void;
    onCreateBlockAfter: (  blockId: string   ) => void;
    onDeleteBlock: ( blockId: string ) => void,
    focusedBlockId: string | null;
}


export default function BlockList({
    page,
    blocks,
    onUpdateBlock,
    onCreateBlockAfter,
    onDeleteBlock,
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
                    onUpdateBlock={onUpdateBlock}
                    onCreateBlockAfter={   onCreateBlockAfter   }
                    onDeleteBlock={onDeleteBlock}
                    focused={  block.id === focusedBlockId }

                />
            ))}
        </div>
    );
}