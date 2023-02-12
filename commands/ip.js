const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ip")
		.setDescription("Responds with the IP of John_Kick's PC. Do not fuck with it!"),
	async execute(interaction) {
		const response = await fetch("https://api.ipify.org?format=json");
		const json = await response.json();
		const ip = json.ip;

		if (!ip) {
			interaction.reply("Could not retrieve IP address. Please try again later.");
			return;
		}
		try {
			interaction.reply(ip);
		} catch (e) {
			console.error("An error occurred when trying to retreive the IP address:\n" + e.message);
		}
	},
};
