import { useEffect, useRef, useState } from "react";
import type { Block, BlockType } from "../types";
import SlashMenu from "../slash/SlashMenu";

interface Props {
    block: Block;

    onUpdateBlock: (blockId: string, content: string) => void;

    onConvertBlock: (
        blockId: string,
        type: BlockType,
        content: any
    ) => void;

    onCreateBlockAfter?: (blockId: string) => void;
    onDeleteBlock?: (blockId: string) => void;

    focused?: boolean;
}

export default function HeadingBlock({
    block,
    onUpdateBlock,
    onConvertBlock,
    onCreateBlockAfter,
    onDeleteBlock,
    focused
}: Props) {

    if (block.type !== "heading") return null;

    const [value, setValue] = useState<string>(
        String(block.content ?? "")
    );

    const inputRef = useRef<HTMLTextAreaElement | null>(null);

    const [showSlashMenu, setShowSlashMenu] = useState(false);
    const [slashQuery, setSlashQuery] = useState("");

    // sync external updates
    useEffect(() => {
        setValue(String(block.content ?? ""));
    }, [block.content]);

    // focus behavior
    useEffect(() => {
        if (focused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [focused]);

    // auto resize
    useEffect(() => {
        autoResize();
    }, [value]);

    function autoResize() {
        if (!inputRef.current) return;

        inputRef.current.style.height = "0px";
        inputRef.current.style.height =
            `${inputRef.current.scrollHeight}px`;
    }

    function updateSlashMenu(input: string) {
        if (!input.startsWith("/")) {
            setShowSlashMenu(false);
            setSlashQuery("");
            return;
        }

        setShowSlashMenu(true);
        setSlashQuery(input.substring(1).toLowerCase());
    }

    function handleChange(
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) {
        const newValue = event.target.value;

        updateSlashMenu(newValue);

        setValue(newValue);

        onUpdateBlock(block.id, newValue);
    }

    function handleKeyDown(
        event: React.KeyboardEvent<HTMLTextAreaElement>
    ) {
        if (event.key === "Enter" && event.shiftKey) {
            event.preventDefault();
            onCreateBlockAfter?.(block.id);
        }

        if (event.key === "Backspace" && value === "") {
            event.preventDefault();
            onDeleteBlock?.(block.id);
        }
    }

    function handleSlashCommand(command: string) {

          //  ALWAYS close menu immediately FIRST
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
        }

    }

    return (
        <div style={{ position: "relative", padding: "6px 0" }}>
            
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
            <textarea
                ref={inputRef}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Heading..."
                style={{
                    width: "100%",
                    minHeight: "40px",
                    overflow: "hidden",
                    border: "none",
                    outline: "none",
                    resize: "none",
                    background: "transparent",
                    color: "inherit",
                    fontFamily: "inherit",

                    //  key difference: heading styling
                    fontSize: "1.6rem",
                    fontWeight: 600,
                    lineHeight: "1.3"
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