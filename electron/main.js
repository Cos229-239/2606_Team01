// Import Electron modules used to control the application
// and create native desktop windows.
import { app, BrowserWindow } from "electron";
import { createMainWindow } from "./windows/mainWindow.js";
import { createTimerWindow } from "./windows/timerWindow.js";
import { ipcMain } from "electron";




        // Wait until Electron has finished starting before
        // creating the application's main window.
    app.whenReady().then(() =>
    {
            //creates mainWindow for application
        createMainWindow();

        //temp show timer
        createTimerWindow();
    });

    ipcMain.on("open-timer", () =>
        {
            createTimerWindow();
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