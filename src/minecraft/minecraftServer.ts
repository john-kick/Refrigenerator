import { JavaServer } from "@scriptserver/core";
import { minecraftServerPath } from "../config.json";

interface McServerConfig {
	flavor: string
	javaServer: {
		jar: string
		path: string
		args: string[]
	}
}

const DEFAULT_MCSERVER_CONFIG: McServerConfig = {
	flavor: "vanilla",
	javaServer: {
		jar: "server.jar",
		path: minecraftServerPath,
		args: ["-Xms4G", "-Xmx8G"]
	}
};

export class MinecraftServer {
	server: JavaServer;

	constructor(mcConfig?: McServerConfig) {
		mcConfig = mcConfig || DEFAULT_MCSERVER_CONFIG;
		this.server = new JavaServer(mcConfig);
	}

	start() {
		this.server.start();
	}

	stop() {
		this.server.stop();
	}

	send(command: string) {
		this.server.send(command);
	}
}
