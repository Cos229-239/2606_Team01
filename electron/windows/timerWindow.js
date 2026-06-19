//Imports
import { BrowserWindow } from "electron";
import path from "path";



        //Creates floating timer
    export function createTimerWindow()
    {
        const timerWindow = new BrowserWindow(
            {
                width: 420,
                height: 420,

                alwaysOnTop: true,
                resizable: false,
                maximizable: false,
                fullscreenable: false,

                autoHideMenuBar: true,

                webPreferences:
                         {
                             preload: path.join(__dirname, "../preload.js")
                         }

               
            }
        );

        timerWindow.setAlwaysOnTop(true, "floating");

        //Load timerWindow from reactr page
        timerWindow.loadURL("http://localhost:5173/timer");

        return timerWindow;
    }