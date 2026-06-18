// Import Electron modules used to control the application
// and create native desktop windows.
import { app, BrowserWindow } from "electron";


        /// Creates the main desktop window 
        //      and loads the React application.
    function createWindow()
    {
        const mainWindow = new BrowserWindow(
            {
                width:2200,
                height: 1380
            }
        );
            // During development, load the Vite development server.
            // React takes over from this point and renders the application.
        mainWindow.loadURL("http://localhost:5173");
    }


        // Wait until Electron has finished starting before
        // creating the application's main window.
    app.whenReady().then(() =>
    {
        createWindow();
    });


        // Recreate the window if the application is activated
        // and no windows are currently open (primarily for macOS).
    app.on("activate", () =>
    {
        if (BrowserWindow.getAllWindows().length === 0)
        {
            createWindow();
        }
    });


        // Close the application once every window has been closed.
    app.on("window-all-closed", () =>
    {
        app.quit();
    });