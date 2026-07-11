import { useState } from "react";

interface StartSessionPopupProps
{
    onClose: () => void;

    onStart: (sessionData: {
        type: string;
        plannedDuration: number;
        mood: string;
        goal: string;
    }) => void;

//lets the same popup be reused for editing.
    // When provided, fields are pre-filled from the existing session
    // instead of the hardcoded defaults.
    initialData?: {
        type: string;
        plannedDuration: number;
        mood: string;
        goal: string;
    };

    mode?: "create" | "edit";
}

export default function StartSessionPopup(
{
    onClose,
    onStart,
    initialData,   
    mode = "create"
}: StartSessionPopupProps)
{
    const [type, setType] = useState("Coding");
    const [duration, setDuration] = useState(60);
    const [mood, setMood] = useState("Focus");
    const [goal, setGoal] = useState("");

    return (
         <div
        style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            pointerEvents: "auto",
        }}
    >
        <div
            style={{
                width: "400px",
                background: "#1a1a2e",
                padding: "20px",
                borderRadius: "10px",
                zIndex: 10000,
            }}
            onClick={(e) =>
                e.stopPropagation()
            }
        >
                <h2>{mode === "edit" ? "Edit Session" : "Start Session"}</h2>

                {/* TYPE */}
                <label>Type</label>
                <input
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    style={{ width: "100%", marginBottom: "10px" }}
                />

                {/* DURATION */}
                <label>Duration (minutes)</label>
                <input
                    type="number"
                    value={duration}
                    onChange={(e) =>
                        setDuration(Number(e.target.value))
                    }
                    style={{ width: "100%", marginBottom: "10px" }}
                />

                {/* MOOD */}
                <label>Mood</label>
                <select
                    value={mood}
                    onChange={(event) =>
                        setMood(event.target.value)
                    }
                    style={{
                        width: "100%",
                        marginBottom: "20px",
                    }}
                >
                    <option value="Focus">Focus</option>
                    <option value="Planning">Planning</option>
                    <option value="Recharge">Recharge</option>
                </select>

                
                {/* GOAL */}

                <label>
                    Session Goal
                </label>


                <textarea
                    value={goal}
                    onChange={(e)=>
                        setGoal(e.target.value)
                    }

                    placeholder="What do you want to accomplish?"
                    
                    style={{
                        width:"100%",
                        height:"80px",
                        marginBottom:"20px"
                    }}
                />




                <button
                    onClick={() =>
                        onStart({ 
            type, plannedDuration: duration,
            mood,  goal, 
        })
                    }
                    style={{ marginRight: "10px" }}
                >
                     {mode === "edit" ? "Save" : "Start"}
                </button>

                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}