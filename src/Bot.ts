import { Client, GatewayIntentBits } from "discord.js";
import { token } from "./config.json";
import interactionCreate from "./listeners/interactionCreate";
import ready from "./listeners/ready";
import runStupidMaker from "./scripts/stupidMaker";

console.log("Bot is starting...");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildModeration,
  ],
});

ready(client);
interactionCreate(client);

client.on("messageCreate", (message) => {
  runStupidMaker(message);
});

client.login(token);
