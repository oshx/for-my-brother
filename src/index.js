const { app, BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");

const config = require("./app.json");

let win;

function createWindow() {
    win = new BrowserWindow({
        width: config.width,
        height: config.height,
        webPreferences: {
            devTools: false,
            nodeIntegration: true,
        },
        // frame: false,
    });
    win.setMenu(null);
    win.setResizable(false);
    // win.webContents.openDevTools();

    win.loadURL(url.format({
        pathname: path.join(__dirname, "./index.html"),
        protocol: "file:",
        slashes: true
    }))
    win.on("closed", () => win = null);
}

app.on("ready", createWindow);
