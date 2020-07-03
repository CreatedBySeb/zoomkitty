import { IpcRenderer } from "electron";

declare global {
	const ipc: IpcRenderer;
}
