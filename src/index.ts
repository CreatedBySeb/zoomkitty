import { app, BrowserWindow, ipcMain, remote, shell } from "electron";
import * as path from "path";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
let mainWindow: BrowserWindow;

app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) { // eslint-disable-line global-require
	app.quit();
}

ipcMain.on("open", (_event, link) => {
	shell.openExternal(link);
});

const createWindow = (): void => {
	mainWindow = new BrowserWindow({
		backgroundColor: "#202020",
		height: 600,
		minHeight: 600,
		minWidth: 800,
		width: 800,
		webPreferences: {
			allowRunningInsecureContent: false,
			preload: path.resolve(__dirname, "../../preload.js"),
			webSecurity: false,
		},
	});

	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

app.on("ready", () => {
	createWindow();
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
