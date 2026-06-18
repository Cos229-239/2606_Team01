import { app, BrowserWindow } from "electron";

function createWindow()
{
    const mainWindow = new BrowserWindow(
        {
            width:2200,
            height: 1380
        }
    );

    mainWindow.loadURL("http://localhost:5173");
}


app.whenReady().then(() =>
{
    createWindow();
});

app.on("activate", () =>
{
    if (BrowserWindow.getAllWindows().length === 0)
    {
        createWindow();
    }
});

app.on("window-all-closed", () =>
{
    app.quit();
});