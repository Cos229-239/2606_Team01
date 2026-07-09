import type { Block } from "../types";

interface Props {
    block: Block;
}

export default function DividerBlock({}: Props) {
    return (
        <hr style={{ margin: "12px 0" }} />
    );
}