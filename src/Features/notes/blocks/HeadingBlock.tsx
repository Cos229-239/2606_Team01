import type { Block } from "../types";

interface Props {
    block: Block;
}

export default function HeadingBlock({ block }: Props) {
    return (
        <h2 style={{ margin: "10px 0" }}>
            {block.type === "heading" ? block.content : ""}
        </h2>
    );
}