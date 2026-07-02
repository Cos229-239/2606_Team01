// Import Electron modules used to control the application
// and create native desktop windows.
import { app, BrowserWindow } from "electron";
import { createMainWindow } from "./windows/mainWindow.js";
import { createTimerWindow } from "./windows/timerWindow.js";
import { ipcMain, Notification } from "electron";

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
    // `silent: true` because no sound yet — app-specific audio is
    // planned for later, this just covers the visual popup for now.
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