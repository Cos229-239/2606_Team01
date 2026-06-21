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
    }
});