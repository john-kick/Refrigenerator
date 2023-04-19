import { MinecraftServer } from "./minecraftServer";

const server: MinecraftServer = new MinecraftServer();

export function startServer() {
	server.start();
}

export function stopServer() {
	server.stop();
}

export function sendCommand(command: string) {
	server.send(command);
}
