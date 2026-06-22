import { useState, useEffect, useRef } from "react";
import type { Block } from "../types";

interface EmptyBlockProps {
    block: Block;
    onUpdateBlock?: (blockId: string, content: string) => void;
}

/**
 * EmptyBlock
 * ------------------------------------------------------
 * First interactive editor surface in the Notes system.
 *
 * Responsibility:
 * - Provide an editable input area for empty blocks
 * - Capture user typing
 * - Optionally notify parent of updates
 */
export default function EmptyBlock({
    block,
    onUpdateBlock,
}: EmptyBlockProps) {
    const [value, setValue] = useState<string>(
        typeof block.content === "string"
            ? block.content
            : ""
    );

    const inputRef = useRef<HTMLTextAreaElement | null>(null);

    // Keep local state in sync if block changes externally
    useEffect(() => {
        if (typeof block.content === "string") {
            setValue(block.content);
        }
    }, [block.content]);

    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const newValue = e.target.value;
        setValue(newValue);

        // bubble up to parent system (if wired later)
        if (onUpdateBlock) {
            onUpdateBlock(block.id, newValue);
        }
    }

    function handleClick() {
        inputRef.current?.focus();
    }

    return (
        <div
            onClick={handleClick}
            style={{
                width: "100%",
                padding: "8px 0",
                cursor: "text",
            }}
        >
            <textarea
                ref={inputRef}
                value={value}
                onChange={handleChange}
                placeholder="Click here to start writing..."
                style={{
                    width: "100%",
                    minHeight: "24px",
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
    );
}