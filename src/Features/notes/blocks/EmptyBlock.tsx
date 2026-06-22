import { useState, useEffect, useRef } from "react";
import type { Block } from "../types";


interface EmptyBlockProps {
    block: Block;
    onUpdateBlock?: (blockId: string, content: string) => void;

    onCreateBlockAfter?: ( blockId: string  ) => void;
    focused?: boolean;
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
    onCreateBlockAfter,
    focused,

}: EmptyBlockProps) {
     const [value, setValue] = useState<string>(
        block.type === "empty"
            ? String(block.content ?? "")
            : ""
    );

    const inputRef = useRef<HTMLTextAreaElement | null>(null);

    // Sync with external updates
    useEffect(() => {
        if (block.type === "empty") {
              setValue(
                String(block.content ?? "")
            );
        }
    }, [block]);
    
    // ==================================================
    // Text Updates
    // ==================================================

    function handleChange(
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) {
        const newValue = event.target.value;

        setValue(newValue);

        onUpdateBlock?.(
            block.id,
            newValue
        );
    }

    // ==================================================
    // Keyboard Controls
    // ==================================================

    function handleKeyDown(
        event: React.KeyboardEvent<HTMLTextAreaElement>
    ) {
        if (event.key === "Enter" &&  event.shiftKey) 
        {
            event.preventDefault();

            onCreateBlockAfter?.(
                block.id
            );
        }
    }

    // ==================================================
    // Focus Helpers
    // ==================================================

    function handleClick() {
        inputRef.current?.focus();
    }

    // ==================================================
    // Render
    // ==================================================


    useEffect(() =>
{
    if (
        focused &&
        inputRef.current
    )
    {
        inputRef.current.focus();
    }
}, [focused]);

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
                onKeyDown={handleKeyDown}
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