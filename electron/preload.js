// ======================================================
// preload.ts
// ------------------------------------------------------
// Safe bridge between React (Renderer)
// and Electron (Main Process).
// 

import {contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", 
    {
        openTimer: () => ipcRenderer.send("open-timer"),

    }
);