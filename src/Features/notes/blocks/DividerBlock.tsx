import { useState } from "react";
import type { Block } from "../types";
import { useConfirmDelete } from "../../../Components/ConfirmDialog";

interface Props {
    block: Block;
    onDeleteBlock?: (blockId: string) => void;
}

export default function DividerBlock({ block, onDeleteBlock }: Props) {
    // Hover-reveal delete control, same idea as the "X" buttons used
    // elsewhere in the app (NotebookBrowser rows, TaskCard) — dividers
    // have no text to backspace through, so they need an explicit way
    // to be removed.
    const [hovered, setHovered] = useState(false);
    const { requestDelete, confirmDialog } = useConfirmDelete();

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "6px 0",
            }}
        >
            {confirmDialog}
            <hr style={{ flex: 1, margin: 0 }} />

            {onDeleteBlock && (
                <button
                    type="button"
                    onClick={() =>
                        requestDelete("Delete this divider?", () => onDeleteBlock(block.id))
                    }
                    title="Remove divider"
                    style={{
                        flexShrink: 0,
                        width: "22px",
                        height: "22px",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        lineHeight: 1,
                        opacity: hovered ? 0.7 : 0,
                        pointerEvents: hovered ? "auto" : "none",
                        transition: "opacity 0.15s ease",
                    }}
                >
                    ✕
                </button>
            )}
        </div>
    );
}
