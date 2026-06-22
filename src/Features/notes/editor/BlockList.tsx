import type { Page, Block } from "../types";
import BlockRenderer from "./BlockRenderer";

interface BlockListProps {
    page: Page;
    blocks: Block[];
    onUpdateBlock: (blockId: string, content: string) => void;
}

/**
 * BlockList
 * ------------------------------------------------------
 * Responsibility:
 * - Resolve page.blockIds → real blocks
 * - Pass update handlers to BlockRenderer
 */
export default function BlockList({
    page,
    blocks,
    onUpdateBlock,
}: BlockListProps) {
    const blockMap = new Map<string, Block>();

    for (const block of blocks) {
        blockMap.set(block.id, block);
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
            }}
        >
            {page.blockIds.map((blockId) => {
                const block = blockMap.get(blockId);

                if (!block) return null;

                return (
                    <BlockRenderer
                        key={block.id}
                        block={block}
                        onUpdateBlock={onUpdateBlock}
                    />
                );
            })}
        </div>
    );
}