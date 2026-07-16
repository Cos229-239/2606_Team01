import type { Block, BlockType } from "../types";
import SlashMenu from "../slash/SlashMenu";
import { useEffect, useRef, useState } from "react";


interface Props {
    block: Block;

    onUpdateBlock: (blockId: string, content: string) => void;
    onConvertBlock: (  blockId: string,  type: BlockType,
                             content: any  ) => void;
    onCreateBlockAfter?: (  blockId: string  ) => void;
    onDeleteBlock?: (  blockId: string  ) => void;
    
    focused?: boolean;
}

export default function ListBlock({ block, onUpdateBlock, 
    onConvertBlock, onCreateBlockAfter, onDeleteBlock, 
    focused }: Props) {

    if (block.type !== "list") return null;

const [value, setValue] = useState<string>(
        typeof block.content === "string"
            ? block.content
            : ""
    );

    const inputRef =
        useRef<HTMLTextAreaElement | null>(null);

    const [showSlashMenu, setShowSlashMenu] =
        useState(false);

    const [slashQuery, setSlashQuery] =
        useState("");

    // ==========================================
    // Sync External Updates
    // ==========================================

    useEffect(() => {
        if (typeof block.content === "string") {
            setValue(block.content);
        }
    }, [block.content]);

    // ==========================================
    // Focus
    // ==========================================
 useEffect(() => {
        if (focused && inputRef.current) {

            inputRef.current.focus();

            // Place cursor at end of list
            const length =
                inputRef.current.value.length;

            inputRef.current.setSelectionRange(
                length,
                length
            );
        }
    }, [focused]);

    // ==========================================
    // Auto Resize
    // ==========================================

    useEffect(() => {
        autoResize();
    }, [value]);

    function autoResize() {

        if (!inputRef.current) {
            return;
        }

        inputRef.current.style.height = "0px";

        inputRef.current.style.height =
            `${inputRef.current.scrollHeight}px`;
    }

    // ==========================================
    // Slash Menu
    // ==========================================

    function updateSlashMenu(
        input: string
    ) {

        if (!input.startsWith("/")) {

            setShowSlashMenu(false);
            setSlashQuery("");
            return;
        }

        setShowSlashMenu(true);

        setSlashQuery(
            input.substring(1).toLowerCase()
        );
    }

    function handleSlashCommand(command: string) {
        
        setShowSlashMenu(false);
        setSlashQuery("");
        
        switch (command) {
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
                onConvertBlock?.(block.id, "checklist", []);
                break;
        }

    }

    // ==========================================
    // Change
    // ==========================================

    function handleChange(
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) {

        const newValue =
            event.target.value;

        updateSlashMenu(newValue);

        setValue(newValue);

        autoResize();

        onUpdateBlock(
            block.id,
            newValue
        );
    }

    // ==========================================
    // Keyboard
    // ==========================================

    function handleKeyDown(
        event: React.KeyboardEvent<HTMLTextAreaElement>
    ) {

        if (
            event.key === "Enter" &&
            event.shiftKey
        ) {

            event.preventDefault();

            onCreateBlockAfter?.(
                block.id
            );
        }

        if (
            event.key === "Backspace" &&
            value === ""
        ) {

            event.preventDefault();

            onDeleteBlock?.(
                block.id
            );
        }
    }

    // ==========================================
    // Bullet Count
    // ==========================================

    const lines =
        value === ""
            ? [""]
            : value.split("\n");

    return (

        <div
            style={{
                position: "relative",
                padding: "6px 0",
            }}
        >

           
                 <div style={{
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

                {/* display left Bullet Column */}

                <div
                    style={{
                        width: "20px",
                        paddingTop: 6,
                        userSelect: "none",
                    }}
                >
                    {lines.map((_, index) => (

                        <div
                            key={index}
                            style={{
                                lineHeight: "1.5rem",
                            }}
                        >
                            •
                        </div>

                    ))}
                </div>

                   
                {/* Text Editor */}

                <textarea
                    ref={inputRef}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="List item..."
                    style={{
                        width: "100%",
                        minHeight: "30px",
                        overflow: "hidden",
                        border: "none",
                        outline: "none",
                        resize: "none",
                        fontSize: "1rem",
                        lineHeight: "1.5",
                        background: "transparent",
                        color: "inherit",
                        fontFamily: "inherit",
                    }}
                />
                

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