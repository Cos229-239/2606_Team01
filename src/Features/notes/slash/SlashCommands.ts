import type { BlockType } from "../types";

export interface SlashCommand
{
    id: BlockType;
    command: string;
    label: string;
}

export const SLASH_COMMANDS: SlashCommand[] =
[
    {
        id: "divider",
        command: "divider",
        label: "Divider",
    },
    {
        id: "list",
        command: "list",
        label: "List",
    },
    {
        id: "heading",
        command: "heading",
        label: "Heading",
    },
    {
        id: "text",
        command: "text",
        label: "Text",
    },
];

