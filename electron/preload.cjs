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
    },

    // Opens a native "choose a file" dialog filtered to common audio
    // formats. Resolves with the chosen absolute path, or null if the
    // user cancelled.
    selectAudioFile: () => {
        return ipcRenderer.invoke("select-audio-file");
    },

    // Reads an audio file from disk and hands back a base64 data URL so
    // the renderer can play it via <audio> without hitting Chromium's
    // file:// access restrictions. Resolves null on failure.
    readAudioFileAsDataUrl: (filePath) => {
        return ipcRenderer.invoke("read-audio-file", filePath);
    },

    // Profile (name, titles, bio, photo) — persisted to its own JSON
    // file on disk under userData/profile, via main.js.
    profile: {
        load: () => ipcRenderer.invoke("profile:load"),
        save: (profile) => ipcRenderer.invoke("profile:save", profile),
    }
});