import { SlashCommandBuilder } from "discord.js";
import { startServer } from "../../minecraft/mcServerConnector.js";
import { isActive } from "../../minecraft/serverStatus.js";

export const data = new SlashCommandBuilder().setName("startserver").setDescription("Starts the minecraft server");
export async function execute(interaction) {
	if (await isActive()) {
		await interaction.reply("A server is already online. Use the /mcstatus command to see the currently active server");
		return;
	}
	startServer();
	await interaction.reply("Starting server. Please wait a few seconds for it to start.");
}
