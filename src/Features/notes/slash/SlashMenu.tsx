import { SLASH_COMMANDS } from "./SlashCommands";

interface SlashMenuProps
{
    query: string;

    onSelect: (command: string) => void;
}

export default function SlashMenu({
    query,
    onSelect,
}: SlashMenuProps)
{
    const filteredCommands = SLASH_COMMANDS.filter((command) =>
        command.command.startsWith(
            query.toLowerCase()
        )
    );

    if (filteredCommands.length === 0)
    {
        return null;
    }

    return (
        <div
            style={{
                position: "absolute",
                top: "100%",
                left: 0,

                width: 220,

                backgroundColor: "#252525",
                border: "1px solid #444",
                borderRadius: 8,

                padding: 6,

                zIndex: 1000,
            }}
        >
            {filteredCommands.map((command) => (
                <button
                    key={command.id}
                    onClick={() =>
                        onSelect(command.command)
                    }
                    style={{
                        width: "100%",

                        padding: "10px",

                        border: "none",
                        background: "transparent",

                        color: "white",

                        cursor: "pointer",
                        textAlign: "left",
                    }}
                >
                    {command.label}
                </button>
            ))}
        </div>
    );
}