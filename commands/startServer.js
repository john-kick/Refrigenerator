import { SlashCommandBuilder } from "discord.js";
import { startServer } from "../mcServerConnector.js";

export const data = new SlashCommandBuilder().setName("start_server").setDescription("Starts the minecraft server");
export async function execute(interaction) {
	startServer();
	await interaction.reply("Starting server!");
}
