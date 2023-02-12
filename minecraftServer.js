import { ScriptServer } from "@scriptserver/core";
import { useEssentials } from "@scriptserver/essentials";

const DEFAULT_CONFIG = {
    flavor: "vanilla",
    javaServer: {
        jar: "server.jar",
        path: "/home/andre/server/games/minecraft/vanilla/1.19.3 with the lads/",
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
        this.server = new ScriptServer(config);
        useEssentials(this.server);
    }

    start() {
        this.server.start();
    }

    stop() {
        this.server.stop();
    }
}