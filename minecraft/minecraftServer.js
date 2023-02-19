import { ScriptServer } from "@scriptserver/core";
import { Util } from "../util.js";

const DEFAULT_MCSERVER_CONFIG = {
	flavor: "vanilla",
	javaServer: {
		jar: "server.jar",
		path: Util.getConfig().minecraftServerPath,
		args: ["-Xms4G", "-Xmx8G"]
	}
};

export class MinecraftServer {
	constructor(mcConfig) {
		mcConfig = mcConfig || DEFAULT_MCSERVER_CONFIG;
		this.server = new ScriptServer(mcConfig);
	}

	start() {
		console.log(Util.getConfig().minecraftServerPath);
		this.server.start();
	}

	stop() {
		this.server.stop();
	}

	send(command) {
		this.server.send(command);
	}
}
