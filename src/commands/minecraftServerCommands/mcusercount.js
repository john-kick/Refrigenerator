import { SlashCommandBuilder } from "discord.js";
import { isActive, playerCount } from "../../minecraft/serverStatus.js";

export const data = new SlashCommandBuilder()
	.setName("mcplayercount")
	.setDescription("Replies with the number of currently connected players");
export async function execute(interaction) {
	if (!await isActive()) {
		interaction.reply("No server is running, so no player count could be determined.");
		return;
	}
	interaction.reply(`Connected players: ${await playerCount()}`);
}
