import { CommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { Command } from "../Command"

export const User: Command = {
	name: "user",
	description: "Returns info about the user",
	type: ApplicationCommandType.ChatInput,
	run: async (client: Client, interaction: CommandInteraction) => {
		const content = `This command was run by ${interaction.user.username}.`;

		await interaction.followUp({
			ephemeral: true,
			content
		});
	}
}
