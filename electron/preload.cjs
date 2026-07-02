// ======================================================
// preload.cjs
// ------------------------------------------------------
// Safe bridge between the Renderer (React)
// and the Main Process.
// ======================================================

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    openTimer: () => {
        console.log("openTimer called");
        ipcRenderer.send("open-timer");
    },

    // Tells the main process a countdown just hit zero, so it can pop a
    // native OS notification. payload is simple text only for now —
    // { title, body }.
    notifyTimerComplete: (payload) => {
        console.log("[preload] notifyTimerComplete called", payload);
        ipcRenderer.send("timer-complete", payload);
    }
});