const net = require("node:net");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("led")
		.setDescription("Sends command to control LED strips")
		.addStringOption((option) =>
			// eslint-disable-next-line comma-dangle
			option.setName("command").setDescription("The command to be sent").setRequired(true)
		),
	async execute(interaction) {
		try {
			const socket = net.createConnection(5000, "192.168.178.98");
			const msg = interaction.options.getString("command");
			socket.write(" " + msg + "\n\r\n");
			interaction.reply(`Command ${msg} was successfully sent!`);
		} catch (error) {
			console.log(error);
			interaction.reply(`An error occurred while sending the command.`);
		}
	},
};
