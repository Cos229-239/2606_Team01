import type { Block } from "../types";

interface Props {
    block: Block;
}

export default function ListBlock({ block }: Props) {
    if (block.type !== "list") return null;

    return (
        <ul>
            {block.content.items.map((item) => (
                <li key={item.id}>{item.text}</li>
            ))}
        </ul>
    );
}