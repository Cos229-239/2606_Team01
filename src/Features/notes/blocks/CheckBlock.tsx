import type { Block, BlockType } from "../types";
import CheckList from "../../../Components/Checklist";
import { useState } from "react";
import SlashMenu from "../slash/SlashMenu";

interface Props {
    block: Block;

    onUpdateBlock: (blockId: string, content: any) => void;
    onConvertBlock: (  blockId: string,  type: BlockType,
                         content: any  ) => void;

    onCreateBlockAfter?: (  blockId: string  ) => void;
    onDeleteBlock?: (  blockId: string  ) => void;

    focused?: boolean;
}


export default function CheckBlock(
    { block, onUpdateBlock,
      onCreateBlockAfter, onConvertBlock, 
      onDeleteBlock, focused,
     }: Props) {

    if (block.type !== "checklist") return null;

const [showSlashMenu, setShowSlashMenu] =
    useState(false);

const [slashQuery, setSlashQuery] =
    useState("");

function updateSlashMenu(input: string)
{
    if (!input.startsWith("/"))
    {
        setShowSlashMenu(false);
        setSlashQuery("");
        return;
    }

    setShowSlashMenu(true);

    setSlashQuery(
        input.substring(1).toLowerCase()
    );
}

function handleSlashCommand(command: string)
{
    setShowSlashMenu(false);
    setSlashQuery("");

    switch (command)
    {
        case "divider":
            onConvertBlock(block.id, "divider", null);
            break;

        case "list":
            onConvertBlock(block.id, "list", null);
            break;

        case "text":
            onConvertBlock(block.id, "text", null);
            break;

        case "heading":
            onConvertBlock(block.id, "heading", null);
            break;

        case "checklist":
            onConvertBlock(block.id, "checklist", []);
            break;
    }
}

   return (
    <div
        style={{
            position: "relative",
            padding: "6px 0",
        }}
    >
        <div
            style={{
                position: "relative",
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
            }}
        >
            <button
                onClick={() => setShowSlashMenu(true)}
            >
                +
            </button>

        <div
            style={{
                flex: 1,
            }}
        >
            <CheckList
                items={block.content}
                onItemsChange={(items) =>
                    onUpdateBlock(block.id, items)
                }
                onExit={() =>
                    onCreateBlockAfter?.(block.id)
                }
                focused={focused}
            />
        </div>
        </div>

        {showSlashMenu && (
            <SlashMenu
                query={slashQuery}
                onSelect={handleSlashCommand}
            />
        )}
    </div>
);
}