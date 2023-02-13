import { JavaServer } from "@scriptserver/core";
import { Util } from "./util.js";

const config = Util.getConfig();

const DEFAULT_CONFIG = {
    flavor: "vanilla",
    javaServer: {
        jar: "server.jar",
        path: config.minecraftServerPath,
        args: ["-Xms4G", "-Xmx8G"]
    },
    rconConnection: {
        port: 25565,
        password: "rconPassword"
    }
};

export class MinecraftServer {

    constructor(config) {
        config = config || DEFAULT_CONFIG;
        this.server = new JavaServer(config);
    }

    start() {
        this.server.start();
    }

    stop() {
        this.server.stop();
    }

    send(command) {
        this.server.send(command);
    }
}