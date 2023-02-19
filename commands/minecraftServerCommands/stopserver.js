import { SlashCommandBuilder } from "discord.js";
import { stopServer } from "../../minecraft/mcServerConnector.js";
import { playerCount } from "../../minecraft/serverStatus.js";

export const data = new SlashCommandBuilder().setName("stopserver").setDescription("Stops the minecraft server");
export async function execute(interaction) {
	if (await playerCount() > 0) {
		await interaction.reply("There is at least one person connected to the server. Please wait until the server is empty before shutting down.");
		return;
	}
	stopServer();
	await interaction.reply("Stopping server!");
}
