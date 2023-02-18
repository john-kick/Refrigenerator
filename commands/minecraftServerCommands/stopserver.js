import { SlashCommandBuilder } from "discord.js";
import { stopServer } from "../../mcServerConnector.js";

export const data = new SlashCommandBuilder().setName("stopserver").setDescription("Stops the minecraft server");
export async function execute(interaction) {
	stopServer();
	await interaction.reply("Stopping server!");
}
