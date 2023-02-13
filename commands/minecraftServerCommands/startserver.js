import { SlashCommandBuilder } from "discord.js";
import { startServer } from "../../mcServerConnector.js";

export const data = new SlashCommandBuilder().setName("startserver").setDescription("Starts the minecraft server");
export async function execute(interaction) {
    startServer();
    await interaction.reply("Starting server!");
}
