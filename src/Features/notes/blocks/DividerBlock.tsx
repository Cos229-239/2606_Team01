import { useState } from "react";
import type { Block, BlockType } from "../types";
import { useConfirmDelete } from "../../../Components/ConfirmDialog";
import SlashMenu from "../slash/SlashMenu";
import Tooltip from "../../../Components/Tooltip";

interface Props {
    block: Block;
    onDeleteBlock?: (blockId: string) => void;
    onConvertBlock?: (
        blockId: string,  type: BlockType,
        content: any  ) => void;
}

export default function DividerBlock(
    { block, onDeleteBlock, onConvertBlock }: Props) {
    // Hover-reveal delete control, same idea as the "X" buttons used
    // elsewhere in the app (NotebookBrowser rows, TaskCard) — dividers
    // have no text to backspace through, so they need an explicit way
    // to be removed.
    const [hovered, setHovered] = useState(false);
    const { requestDelete, confirmDialog } = useConfirmDelete();
    const [showSlashMenu, setShowSlashMenu] = useState(false);
    const [slashQuery, setSlashQuery] = useState("");

    function handleSlashCommand(command: string) {
        setShowSlashMenu(false);
        setSlashQuery("");

        switch (command) {
            case "divider":
                onConvertBlock?.(block.id, "divider", null);
                break;

            case "list":
                onConvertBlock?.(block.id, "list", null);
                break;

            case "text":
                onConvertBlock?.(block.id, "text", null);
                break;

            case "heading":
                onConvertBlock?.(block.id, "heading", null);
                break;
            
            case "checklist":
                onConvertBlock?.(block.id, "checklist", []);
                break;
        }
    }


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
            <Tooltip text="Insert or convert this into a different block type" side="right">
                <button
                    onClick={() => setShowSlashMenu(true)}
                >
                    +
                </button>
            </Tooltip>
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
                 {showSlashMenu && (
                <SlashMenu
                    query={slashQuery}
                    onSelect={handleSlashCommand}
                />
            )}
        </div>
    );
}
