import { useState } from "react";
import { useSmoothScroll } from "../../../Data/useSmoothScroll";


interface JourneyPlanPopupProps
{
    initialPurpose?: string;
    initialSessionsPerWeek?: number;

    onClose: () => void;
    onSave: (data:
    {
        purpose: string;
        sessionsPerWeek: number;
    }) => void;
}


export default function JourneyPlanPopup(
{
    initialPurpose,
    initialSessionsPerWeek,
    onClose,
    onSave,

}: JourneyPlanPopupProps)
{
    const smoothScroll = useSmoothScroll();

    const [purpose, setPurpose] =
        useState(initialPurpose ?? "");

    const [sessionsPerWeek, setSessionsPerWeek] =
        useState(initialSessionsPerWeek ?? 1);

    function handleSubmit()
    {
        onSave({
            purpose,
            sessionsPerWeek,
        });
    }

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.5)",
                zIndex: 2000,
            }}
        >
            <div
                className={`popover-panel${smoothScroll ? "" : " no-motion"}`}
                style={{
                    background: "#1a1a2e",
                    borderRadius: 8,
                    padding: 24,
                    width: 360,
                    transformOrigin: "center",
                }}
            >
                <h3>Journey Plan</h3>

                <div style={{ marginTop: 16 }}>
                    <label>Purpose</label>

                    <input
                        autoFocus
                        type="text"
                        value={purpose}
                        onChange={(event) =>
                            setPurpose(event.target.value)
                        }
                        placeholder="Why are you working on this?"
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: 4,
                        }}
                    />
                </div>

                <div style={{ marginTop: 16 }}>
                    <label>Sessions Per Week</label>

                    <input
                        type="number"
                        min={1}
                        value={sessionsPerWeek}
                        onChange={(event) =>
                            setSessionsPerWeek(
                                Number(event.target.value)
                            )
                        }
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: 4,
                        }}
                    />
                </div>

                <div
                    style={{
                        marginTop: 24,
                        display: "flex",
                        gap: 8,
                        justifyContent: "flex-end",
                    }}
                >
                    <button onClick={onClose}>
                        Cancel
                    </button>

                    <button onClick={handleSubmit}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}