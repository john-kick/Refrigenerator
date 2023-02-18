import { MinecraftServer } from "./minecraftServer.js";

const server = new MinecraftServer();

export function startServer() {
	server.start();
}

export function stopServer() {
	server.stop();
}

export function sendCommand(command) {
	server.send(command);
}
