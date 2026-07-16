//Imports
import { BrowserWindow } from "electron";
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

    // Load timerWindow from react page
    timerWindow.loadURL("http://localhost:5173/timer");

    return timerWindow;
}
