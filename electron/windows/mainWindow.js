//Imports
import { app, BrowserWindow } from "electron";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

    //Creates the primary window
        //loads react application
        export function createMainWindow()
        {
            const mainWindow = new BrowserWindow(
                {
                    width: 1500,
                    height: 950,
                    
                    webPreferences:
                         {
                             preload: path.join(__dirname, "../preload.cjs")
                         }
                }
                
            );  if (app.isPackaged)
            {
                // Packaged build — no dev server exists. Load the built
                // index.html straight off disk instead.
                mainWindow.loadFile(
                    path.join(__dirname, "../../dist/index.html")
                );
            }
            else
            {
                // During development, load the Vite development server.
                // React takes over from this point and renders the application.
                mainWindow.loadURL("http://localhost:5173");
            }

            return mainWindow;
        
            }