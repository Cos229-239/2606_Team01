import { useState } from "react";
import { useSmoothScroll } from "../Data/useSmoothScroll";


export type SortDirection = "asc" | "desc";

export interface SortFieldOption
{
    value: string;
    label: string;
}

interface SortControlProps
{
    fields: SortFieldOption[];
    currentField: string;
    currentDirection: SortDirection;
    onChange: (field: string, direction: SortDirection) => void;
}


export default function SortControl(
{
    fields,
    currentField,
    currentDirection,
    onChange,

}: SortControlProps)
{
    const [isOpen, setIsOpen] =
        useState(false);

    const smoothScroll = useSmoothScroll();

    return (
        <div style={{ position: "relative", display: "inline-block" }}>

            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: "10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                }}
            >
                Sort
            </button>

            <div
                aria-hidden={!isOpen}
                style={{
                    position: "absolute",
                    top: "110%",
                    left: 0,
                    display: "flex",
                    gap: "12px",
                    background: "#1a1a2e",
                    borderRadius: 8,
                    padding: 12,
                    zIndex: 1000,
                    transformOrigin: "top left",
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? "translateY(0) scale(1)" : "translateY(-4px) scale(0.98)",
                    visibility: isOpen ? "visible" : "hidden",
                    pointerEvents: isOpen ? "auto" : "none",
                    transition: smoothScroll
                        ? "opacity 0.16s ease, transform 0.16s ease, visibility 0.16s"
                        : "none",
                }}
            >

                {/* ================= FIELD ================= */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                    }}
                >
                    {fields.map((field) => (
                        <button
                            key={field.value}
                            onClick={() =>
                                onChange(field.value, currentDirection)
                            }
                            style={{
                                textAlign: "left",
                                padding: "4px 8px",
                                border: "none",
                                cursor: "pointer",
                                fontWeight:
                                    field.value === currentField
                                        ? "bold"
                                        : "normal",
                                background:
                                    field.value === currentField
                                        ? "rgba(255,255,255,0.1)"
                                        : "transparent",
                            }}
                        >
                            {field.label}
                        </button>
                    ))}
                </div>

                <div
                    style={{
                        width: 1,
                        background: "rgba(255,255,255,0.15)",
                    }}
                />

                {/* ================= DIRECTION ================= */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                    }}
                >
                    <button
                        onClick={() => onChange(currentField, "asc")}
                        style={{
                            textAlign: "left",
                            padding: "4px 8px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight:
                                currentDirection === "asc"
                                    ? "bold"
                                    : "normal",
                            background:
                                currentDirection === "asc"
                                    ? "rgba(255,255,255,0.1)"
                                    : "transparent",
                        }}
                    >
                        Ascending
                    </button>

                    <button
                        onClick={() => onChange(currentField, "desc")}
                        style={{
                            textAlign: "left",
                            padding: "4px 8px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight:
                                currentDirection === "desc"
                                    ? "bold"
                                    : "normal",
                            background:
                                currentDirection === "desc"
                                    ? "rgba(255,255,255,0.1)"
                                    : "transparent",
                        }}
                    >
                        Descending
                    </button>
                </div>

            </div>

        </div>
    );
}