//Imports
import { BrowserWindow } from "electron";

    //Creates the primary window
        //loads react application
        export function createMainWindow()
        {
            const mainWindow = new BrowserWindow(
                {
                    width: 2200,
                    height: 1300
                }
            );


                // During development, load the Vite development server.
                // React takes over from this point and renders the application.
            mainWindow.loadURL("http://localhost:5173");

            return mainWindow;
        
            }