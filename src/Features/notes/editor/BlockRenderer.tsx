import type { Block } from "../types";

import EmptyBlock from "../blocks/EmptyBlock";
import TextBlock from "../blocks/TextBlock";
import HeadingBlock from "../blocks/HeadingBlock";
import ListBlock from "../blocks/ListBlock";
import DividerBlock from "../blocks/DividerBlock";
import TaskBlock from "../blocks/TaskBlock";

interface BlockRendererProps {
    block: Block;
    onUpdateBlock: (blockId: string, content: string) => void;
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
    onUpdateBlock,
}: BlockRendererProps) {
    switch (block.type) {
        case "empty":
            return (
                <EmptyBlock
                    block={block}
                    onUpdateBlock={onUpdateBlock}
                />
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
            return <TaskBlock block={block} />;

        default:
            return null;
    }
}