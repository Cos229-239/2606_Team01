//Imports
import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Creates floating timer
export function createTimerWindow() {
    const timerWindow = new BrowserWindow({
        width: 300,
        height: 280,

        minWidth: 230,
        minHeight: 120,

        alwaysOnTop: true,
        resizable: true,          // allow resizing so clock scales with clamp()
        maximizable: true,
        fullscreenable: true,

        skipTaskbar: true,
        autoHideMenuBar: true,
        type: 'toolbar',

        webPreferences: {
            preload: path.join(__dirname, "../preload.cjs")
        }
    });

    timerWindow.setAlwaysOnTop(true, "screen-saver");
// CHANGED: same dev/packaged branch as mainWindow.js. The packaged
    // build has no dev server, so /timer has to come from a hash route
    // (#/timer) against the same built index.html instead of a real
    // URL path segment — this only works because main.tsx now uses
    // HashRouter instead of BrowserRouter.
    if (app.isPackaged)
    {
        timerWindow.loadFile(
            path.join(__dirname, "../../dist/index.html"),
            { hash: "/timer" }
        );
    }
    else
    {
        // Load timerWindow from react page
        timerWindow.loadURL("http://localhost:5173/#/timer");
    }

    return timerWindow;
}