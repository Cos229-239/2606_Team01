import type { Block } from "../types";

interface Props {
    block: Block;
}

export default function TextBlock({ block }: Props) {
    return (
        <div style={{ padding: "6px 0" }}>
            {(block.type === "text" ? block.content : "")}
        </div>
    );
}