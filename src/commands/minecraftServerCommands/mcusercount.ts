import { ChatInputCommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { Command } from "../../Command"
import { isActive, playerCount } from "src/minecraft/serverStatus";

export const McPlayerCount: Command = {
	name: "mcplayercount",
	description: "Gives the amount of players currently on the server",
	type: ApplicationCommandType.ChatInput,
	run: async (client: Client, interaction: ChatInputCommandInteraction) => {
		if (!await isActive()) {
			interaction.reply("No server is running, so no player count could be determined.");
			return;
		}

		await interaction.followUp({
			ephemeral: true,
			content: `Connected players: ${await playerCount()}`
		});
	}
}

// import { SlashCommandBuilder } from "discord.js";
// import { isActive, playerCount } from "../../minecraft/serverStatus.js";

// export const data = new SlashCommandBuilder()
// 	.setName("mcplayercount")
// 	.setDescription("Replies with the number of currently connected players");
// export async function execute(interaction) {
// 	if (!await isActive()) {
// 		interaction.reply("No server is running, so no player count could be determined.");
// 		return;
// 	}
// 	interaction.reply(`Connected players: ${await playerCount()}`);
// }
