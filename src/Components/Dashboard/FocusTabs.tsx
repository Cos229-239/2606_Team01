import { useNavigate, useLocation } from "react-router-dom";


interface FocusTab
{
    id: string;
    label: string;
    path: string;
}


// Only tabs for features that actually exist right now.
// No Calendar, no Habits — those features don't exist yet.
const FOCUS_TABS: FocusTab[] =
[
    { id: "home", label: "Home", path: "/" },
    { id: "journey", label: "Journey", path: "/journeyPreview" },
    { id: "tasks", label: "Tasks", path: "/task" },
    { id: "notes", label: "Notes", path: "/notebook" },
];


export default function FocusTabs()
{
    const navigate =
        useNavigate();

    const location =
        useLocation();

    return (
        <div
            style={{
                display: "flex",
                gap: "8px",
                marginBottom: "20px",
            }}
        >
            {FOCUS_TABS.map((tab) =>
            {
                const isActive =
                    location.pathname === tab.path;

                return (
                    <button
                        key={tab.id}
                        onClick={() => navigate(tab.path)}
                        style={{
                            padding: "18px 40px",
                            fontSize: "1.1rem",
                            borderRadius: "8px 8px 0 0",
                            cursor: "pointer",
                            fontWeight: isActive ? "bold" : "normal",
                            backgroundColor: isActive
                                ? "rgba(20,12,55,0.38)"
                                : "transparent",
                            border: "1px solid rgba(255,255,255,0.1)",
                             borderBottom: isActive
                                ? "1px solid transparent"
                                : "1px solid rgba(255,255,255,0.1)",
                        }}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}