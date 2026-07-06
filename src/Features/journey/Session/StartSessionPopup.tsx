import { useState } from "react";

interface StartSessionPopupProps
{
    onClose: () => void;

    onStart: (sessionData: {
        type: string;
        duration: number;
        mood: string;
    }) => void;
}

export default function StartSessionPopup(
{
    onClose,
    onStart,
}: StartSessionPopupProps)
{
    const [type, setType] = useState("Coding");
    const [duration, setDuration] = useState(60);
    const [mood, setMood] = useState("Focus");

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    width: "400px",
                    background: "#1a1a2e",
                    padding: "20px",
                    borderRadius: "10px",
                }}
            >
                <h2>Start Session</h2>

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

                <button
                    onClick={() =>
                        onStart({ type, duration, mood })
                    }
                    style={{ marginRight: "10px" }}
                >
                    Start
                </button>

                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}