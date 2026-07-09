// Import Electron modules used to control the application
// and create native desktop windows.
import { app, BrowserWindow } from "electron";
import { createMainWindow } from "./windows/mainWindow.js";
import { createTimerWindow } from "./windows/timerWindow.js";
import { ipcMain, Notification, dialog } from "electron";
import fs from "node:fs";
import path from "node:path";

    // This is what shows up as the sender name on notifications (instead
    // of the generic "Electron"), in the taskbar, and in userData paths.
    app.setName("BetterEveryDay");

    // Windows groups notifications (and shows the app name on them) by
    // this id. Without it, Windows toasts fall back to a generic
    // "Electron" label instead of the app's own name.
    app.setAppUserModelId("BetterEveryDay");



        // Wait until Electron has finished starting before
        // creating the application's main window.
    app.whenReady().then(() =>
    {
            //creates mainWindow for application
        createMainWindow();

       
    });

    ipcMain.on("open-timer", () =>
        {
            createTimerWindow();
        });

    // Fired by the timer window (via preload) the moment a countdown
    // hits zero. Shows a native OS notification with simple text.
    // `silent: true` because the notification *sound* is handled in the
    // renderer instead (see notificationSound.ts) -- that's what lets
    // users pick a preset or custom sound and control its volume,
    // which the OS notification sound can't do.
    ipcMain.on("timer-complete", (event, payload = {}) =>
        {
            console.log("[main] timer-complete received", payload);
            console.log("[main] Notification.isSupported():", Notification.isSupported());

            if (!Notification.isSupported())
            {
                console.warn("[main] Notification not supported on this platform/build — nothing will show.");
                return;
            }

            const notification = new Notification({
                title: payload.title || "Timer finished",
                body: payload.body || "Your timer is up.",
                silent: true,
            });

                // Clicking the notification brings the window that
                // finished the timer back into focus.
            notification.on("click", () =>
                {
                    const sourceWindow = BrowserWindow.fromWebContents(event.sender);
                    if (sourceWindow)
                    {
                        if (sourceWindow.isMinimized()) sourceWindow.restore();
                        sourceWindow.show();
                        sourceWindow.focus();
                    }
                });

            notification.on("show", () => console.log("[main] notification shown"));
            notification.on("failed", (_e, error) => console.error("[main] notification failed:", error));

            notification.show();
        });

    // Notification sound file picking/reading
    // ------------------------------------------------------
    // Two handlers back the "custom sound" option in
    // Settings > Notifications:
    //   - select-audio-file: opens a native file picker
    //   - read-audio-file: reads the chosen file and returns it
    //     as a base64 data URL, since Chromium's renderer won't
    //     load arbitrary file:// paths directly.
    const AUDIO_MIME_TYPES = {
        ".mp3": "audio/mpeg",
        ".wav": "audio/wav",
        ".ogg": "audio/ogg",
        ".m4a": "audio/mp4",
        ".flac": "audio/flac",
        ".aac": "audio/aac",
    };

    ipcMain.handle("select-audio-file", async (event) =>
        {
            const sourceWindow = BrowserWindow.fromWebContents(event.sender);

            const result = await dialog.showOpenDialog(sourceWindow, {
                title: "Choose a notification sound",
                properties: ["openFile"],
                filters: [
                    { name: "Audio files", extensions: ["mp3", "wav", "ogg", "m4a", "flac", "aac"] },
                ],
            });

            if (result.canceled || result.filePaths.length === 0) return null;
            return result.filePaths[0];
        });

    ipcMain.handle("read-audio-file", async (_event, filePath) =>
        {
            if (!filePath || typeof filePath !== "string") return null;

            try
            {
                const buffer = await fs.promises.readFile(filePath);
                const ext = path.extname(filePath).toLowerCase();
                const mime = AUDIO_MIME_TYPES[ext] || "audio/mpeg";
                return `data:${mime};base64,${buffer.toString("base64")}`;
            }
            catch (error)
            {
                console.error("[main] failed to read custom sound file:", error);
                return null;
            }
        });
    


        // Recreate the window if the application is activated
        // and no windows are currently open (primarily for macOS).
    app.on("activate", () =>
    {
        if (BrowserWindow.getAllWindows().length === 0)
        {
            createMainWindow();
        }
    });


        // Close the application once every window has been closed.
    app.on("window-all-closed", () =>
    {
        app.quit();
    });