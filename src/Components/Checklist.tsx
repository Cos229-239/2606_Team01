import { useEffect, useRef} from "react";


export interface ChecklistItem
{
    id: string;
    text: string;
    checked: boolean;
}


interface CheckListProps
{
    items: ChecklistItem[];
    onItemsChange: (  items: ChecklistItem[]  ) => void;

    // Called on Shift+Enter. The component has no idea what "exit"
    // means to its host — Notes/Journey will use this to create a
    // new block underneath; Task Card will simply ignore it.
    onExit?: () => void;

    focused?: boolean;
}


export default function CheckList(
{
    items = [],
    onItemsChange,
    onExit,
    focused,

}: CheckListProps)
{

    const inputRefs =
        useRef<Record<string, HTMLTextAreaElement | null>>({});

    // ==================================================
    // Never Empty
    // ==================================================
    // A checklist with zero items has nothing to type into.
    // Rather than making every host remember to seed one, this
    // component guarantees there's always at least one row.

    useEffect(() =>
    {
        if (items.length > 0)
        {
            return;
        }

        const seedItem: ChecklistItem =
        {
            id: crypto.randomUUID(),
            text: "",
            checked: false,
        };

        onItemsChange([seedItem]);

    }, [items]);

    // ==================================================
    // Focus
    // ==================================================

    useEffect(() =>
    {
        if (!focused)
        {
            return;
        }

        const firstItem =
            items[0];

        if (!firstItem)
        {
            return;
        }

        inputRefs.current[firstItem.id]?.focus();

    }, [focused]);

    // ==================================================
    // Auto Resize
    // ==================================================

    function autoResize(
        itemId: string
    )
    {
        const inputElement =
            inputRefs.current[itemId];

        if (!inputElement)
        {
            return;
        }

        inputElement.style.height = "0px";

        inputElement.style.height =
            `${inputElement.scrollHeight}px`;
    }

    function focusItem(
        itemId: string
    )
    {
        const inputElement =
            inputRefs.current[itemId];

        if (!inputElement)
        {
            return;
        }

        inputElement.focus();

        const length =
            inputElement.value.length;

        inputElement.setSelectionRange(
            length,
            length
        );
    }

    // ==================================================
    // Toggle Checked
    // ==================================================

    function handleToggleChecked(
        itemId: string
    )
    {
        const updatedItems =
            items.map((item) =>
            {
                if (item.id !== itemId)
                {
                    return item;
                }

                return {
                    ...item,
                    checked: !item.checked,
                };
            });

        onItemsChange(updatedItems);
    }

    // ==================================================
    // Text Change
    // ==================================================

    function handleTextChange(
        itemId: string,
        newText: string
    )
    {
        const updatedItems =
            items.map((item) =>
            {
                if (item.id !== itemId)
                {
                    return item;
                }

                return {
                    ...item,
                    text: newText,
                };
            });

        onItemsChange(updatedItems);

        requestAnimationFrame(() => 
                    { autoResize(itemId);}
    )}

    // ==================================================
    // Create New Item
    // ==================================================

    function handleCreateItemAfter(
        itemId: string
    )
    {
        const newItem: ChecklistItem =
        {
            id: crypto.randomUUID(),
            text: "",
            checked: false,
        };

        const currentIndex =
            items.findIndex(
                (item) => item.id === itemId
            );

        const updatedItems =
            [...items];

        updatedItems.splice(
            currentIndex + 1,
            0,
            newItem
        );

        onItemsChange(updatedItems);

        // Focus needs to happen after the new textarea has
        // actually mounted, so it's deferred a tick.
        requestAnimationFrame(() =>
        {
            focusItem(newItem.id);
        });
    }

    // ==================================================
    // Delete Item
    // ==================================================

    function handleDeleteItem(
        itemId: string
    )
    {
        if (items.length <= 1)
        {
            return;
        }

        const currentIndex =
            items.findIndex(
                (item) => item.id === itemId
            );

        const previousItem =
            items[currentIndex - 1] ?? null;

        const updatedItems =
            items.filter(
                (item) => item.id !== itemId
            );

        onItemsChange(updatedItems);

        if (previousItem)
        {
            requestAnimationFrame(() =>
            {
                focusItem(previousItem.id);
            });
        }
    }

    // ==================================================
    // Keyboard
    // ==================================================

    function handleKeyDown(
        event: React.KeyboardEvent<HTMLTextAreaElement>,
        item: ChecklistItem
    )
    {
        if (event.key === "Enter" && event.shiftKey)
        {
            event.preventDefault();

            onExit?.();

            return;
        }

        if (event.key === "Enter")
        {
            event.preventDefault();

            handleCreateItemAfter(item.id);

            return;
        }

        if (event.key === "Backspace" && item.text === "")
        {
            event.preventDefault();

            handleDeleteItem(item.id);
        }
    }
    

    // ==================================================
    // Render
    // ==================================================

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
            }}
        >
            {items.map((item) =>
            (
                <div
                    key={item.id}
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                    }}
                >
                    <button
                        onClick={() =>
                            handleToggleChecked(item.id)
                        }
                        style={{
                            width: "18px",
                            height: "18px",
                            marginTop: "4px",
                            padding: 0,
                            borderRadius: "4px",
                            border: "1px solid rgba(255,255,255,0.35)",
                            background:
                                item.checked
                                    ? "rgba(120, 220, 150, 0.85)"
                                    : "transparent",
                            cursor: "pointer",
                            flexShrink: 0,
                        }}
                    />

                    <textarea
                        ref={(element) =>
                        {
                            inputRefs.current[item.id] = element;
                        }}
                        value={item.text}
                        onChange={(event) =>
                            handleTextChange(
                                item.id,
                                event.target.value
                            )
                        }
                        onKeyDown={(event) =>
                            handleKeyDown(event, item)
                        }
                        placeholder="Type here..."
                        rows={1}
                        style={{
                            width: "100%",
                            minHeight: "24px",
                            overflow: "hidden",
                            resize: "none",
                            border: "none",
                            outline: "none",
                            fontSize: "1rem",
                            lineHeight: "1.5",
                            background: "transparent",
                            color: "inherit",
                            fontFamily: "inherit",
                            textDecoration:
                                item.checked
                                    ? "line-through"
                                    : "none",
                            opacity:
                                item.checked
                                    ? 0.6
                                    : 1,
                        }}
                    />
                </div>
            ))}
        </div>
    );
}