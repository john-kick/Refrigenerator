import { SlashCommandBuilder } from "discord.js";
import { sendCommand } from "../../minecraft/mcServerConnector.js";

export const data = new SlashCommandBuilder()
	.setName("mccmd")
	.setDescription("Sends a command to the minecraft server")
	.addStringOption((option) => option.setName("command").setDescription("The command to be sent").setRequired(true));
export async function execute(interaction) {
	sendCommand(interaction.options.getString("command"));
	await interaction.reply("Command sent!");
}
