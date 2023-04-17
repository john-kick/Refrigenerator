import { ChatInputCommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { sendCommand } from "../../minecraft/mcServerConnector";
import { Command } from "../../Command"

export const McCmd: Command = {
	name: "mccmd",
	description: "Sends a command to the minecraft server",
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			"name": "command",
			"description": "The command to be sent.",
			"type": ApplicationCommandOptionType.String,
			"required": true,
		}
	],
	run: async (client: Client, interaction: ChatInputCommandInteraction) => {
		const command = interaction.options.getString("command");

		if (command === null) {
			await interaction.followUp({
				ephemeral: true,
				content: "No command specified or could not retreive the command"
			});
			return;
		}

		sendCommand(command);

		await interaction.followUp({
			ephemeral: true,
			content: "Command sent!"
		});
	}
}
