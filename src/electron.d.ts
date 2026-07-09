// ======================================================
// electron.d.ts
// ------------------------------------------------------
// Declares the Electron API exposed by preload.ts.
// This allows TypeScript to recognize
// window.electron throughout the React application.
// ======================================================

export {};

declare global
{
    interface Window
    {
        electron:
        {
            openTimer: () => void;
            notifyTimerComplete: (payload: { title?: string; body?: string }) => void;
            selectAudioFile: () => Promise<string | null>;
            readAudioFileAsDataUrl: (filePath: string) => Promise<string | null>;
        };
    }
}