import { CommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { Command } from "../Command"

export const IP: Command = {
	name: "ip",
	description: "Returns the ip address of the server ip.",
	type: ApplicationCommandType.ChatInput,
	run: async (client: Client, interaction: CommandInteraction) => {
		const response = await fetch("https://api.ipify.org?format=json");
		const json = await response.json();
		const ip = json.ip;

		let content;

		if (!ip) {
			content = "Could not retreive IP address.";
		} else {
			try {
				content = ip;
			} catch (e: any) {
				console.error("An error occurred when trying to retreive the IP address:\n" + e.message);
			}
		}

		await interaction.followUp({
			ephemeral: true,
			content
		});
	}
}


// import { SlashCommandBuilder } from "discord.js";

// export const data = new SlashCommandBuilder()
// 	.setName("ip")
// 	.setDescription("Responds with the IP of John_Kick's PC. Do not fuck with it!");
// export async function execute(interaction) {
// 	const response = await fetch("https://api.ipify.org?format=json");
// 	const json = await response.json();
// 	const ip = json.ip;

// 	if (!ip) {
// 		interaction.reply("Could not retrieve IP address. Please try again later.");
// 		return;
// 	}
// 	try {
// 		interaction.reply(ip);
// 	} catch (e) {
// 		console.error("An error occurred when trying to retreive the IP address:\n" + e.message);
// 	}
// }
