import type { Page, Block } from "../types";
import BlockRenderer from "./BlockRenderer";

interface BlockListProps {
    page: Page;
    blocks: Block[];
    onUpdateBlock: (blockId: string, content: string) => void;
}

export default function BlockList({
    page,
    blocks,
    onUpdateBlock,
}: BlockListProps) {
    if (!page) return null;

    // ONLY blocks belonging to this page
    const pageBlocks = blocks.filter(
        (block) => page.blockIds.includes(block.id)
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
                />
            ))}
        </div>
    );
}