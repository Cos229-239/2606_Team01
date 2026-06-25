//Imports
import { BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Creates floating timer
export function createTimerWindow() {
    const timerWindow = new BrowserWindow({
        width: 420,
        height: 460,

        minWidth: 280,
        minHeight: 200,

        alwaysOnTop: true,
        skipTaskbar: true,
        resizable: true,          // allow resizing so clock scales with clamp()
        maximizable: false,
        fullscreenable: false,

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
