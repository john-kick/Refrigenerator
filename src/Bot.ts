import { Client, ClientOptions, Utils } from "discord.js";
import { token } from "./config.json";
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";

console.log("Bot is starting...");

const client = new Client({
    intents: []
});

ready(client);
interactionCreate(client);

client.login(token);