import { useState, useEffect, useRef } from "react";
import type { Block, BlockType } from "../types";
import SlashMenu from "../slash/SlashMenu";


interface EmptyBlockProps {
    block: Block;
    onUpdateBlock?: (blockId: string, content: string) => void;

    onCreateBlockAfter?: ( blockId: string  ) => void;
    onDeleteBlock?: (  blockId: string  ) => void;
    onConvertBlock?: (  blockId: string, type: BlockType,
                        content: any  ) => void;
    focused?: boolean;
}


export default function EmptyBlock({
    block,
    onUpdateBlock,
    onCreateBlockAfter,
    onDeleteBlock,
    onConvertBlock,
    focused,

}: EmptyBlockProps) {


     const [value, setValue] = useState<string>(
        block.type === "empty"
            ? String(block.content ?? "") : ""
    );

    const [showMenu, setShowMenu] = useState(false);

    const ref = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        setValue(typeof block.content === "string" ? block.content : "");
    }, [block.content]);

    useEffect(() => {
        if (focused) ref.current?.focus();
    }, [focused]);

    function resize() {
        if (!ref.current) return;
        ref.current.style.height = "0px";
        ref.current.style.height = ref.current.scrollHeight + "px";
    }

    function change(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setValue(e.target.value);
        resize();
        onUpdateBlock?.(block.id, e.target.value);
    }

    function keyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault();
            onCreateBlockAfter?.(block.id);
        }

        if (e.key === "Backspace" && value === "") {
            e.preventDefault();
            onDeleteBlock?.(block.id);
        }
    }

    function handleSlashCommand(command: string) 
    {
        switch (command)
        {
            case "divider":
                onConvertBlock?.(block.id, "divider", null);
                
                setShowMenu(false);
                break;


                case "list":
                onConvertBlock?.(block.id, "list", null);
        }
    }

    return (
        <div style={{ width: "100%", padding: "8px 0" }}>

            <div style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                    }}
            >
                <button
                    onClick={() => setShowMenu(true)}
                >
                    +
                </button>
                    <textarea
                        ref={ref}
                        value={value}
                        onChange={change}
                        onKeyDown={keyDown}
                        style={{
                            width: "100%",
                            minHeight: 30,
                            border: "none",
                            outline: "none",
                            resize: "none",
                            fontSize: "1rem",
                            background: "transparent",
                        }}
                        placeholder="Click here to start writing..."
                    />

                    {showMenu && (
                        <SlashMenu
                            query=""
                            onSelect={handleSlashCommand}
                        />
                    )}
            </div>
        </div>
    );
}
