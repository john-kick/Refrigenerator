import { ChatInputCommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { isActive } from "../../minecraft/serverStatus"
import { startServer } from "../../minecraft/mcServerConnector"
import { Command } from "../../Command"

export const StartServer: Command = {
	name: "startserver",
	description: "Starts the minecraft server",
	type: ApplicationCommandType.ChatInput,
	run: async (client: Client, interaction: ChatInputCommandInteraction) => {
		if (await isActive()) {
			await interaction.reply("A server is already online. Use the /mcstatus command to see the currently active server");
			return;
		}
		startServer();

		await interaction.followUp({
			ephemeral: true,
			content: "Starting server. Please wait a few seconds for it to start."
		});
	}
}
