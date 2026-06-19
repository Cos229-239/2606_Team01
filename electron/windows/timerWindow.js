//Imports
import { BrowserWindow } from "electron";


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

                autoHideMenuBar: true

            }
        );

        //Load timerWindow from reactr page
        timerWindow.loadURL("http://localhost:5173/timer");

        return timerWindow;
    }