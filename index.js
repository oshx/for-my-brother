const { app, BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");

const config = require("./config/app.json");

let win;

function createWindow() {
    win = new BrowserWindow({
        width: config.width,
        height: config.height,
        webPreferences: {
            nodeIntegration: true,
        },
    })
    win.loadURL(url.format({
        pathname: path.join(__dirname, "./src/index.html"),
        protocol: "file:",
        slashes: true
    }))
    win.on("closed", () => win = null);
}

app.on("ready", createWindow);
