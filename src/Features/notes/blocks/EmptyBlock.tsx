import { useState, useEffect, useRef } from "react";
import type { Block } from "../types";


interface EmptyBlockProps {
    block: Block;
    onUpdateBlock?: (blockId: string, content: string) => void;

    onCreateBlockAfter?: ( blockId: string  ) => void;
    onDeleteBlock?: (  blockId: string  ) => void;
    focused?: boolean;
}


export default function EmptyBlock({
    block,
    onUpdateBlock,
    onCreateBlockAfter,
    onDeleteBlock,
    focused,

}: EmptyBlockProps) {


     const [value, setValue] = useState<string>(
        block.type === "empty"
            ? String(block.content ?? "")
            : ""
    );

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

    return (
        <div style={{ width: "100%", padding: "8px 0" }}>
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
        </div>
    );
}
