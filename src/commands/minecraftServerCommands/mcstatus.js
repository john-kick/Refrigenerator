import { SlashCommandBuilder } from "discord.js";
import { isActive, getWhich } from "../../minecraft/serverStatus.js";

export const data = new SlashCommandBuilder()
	.setName("mcstatus")
	.setDescription("Checks if the minecraft server is online");
export async function execute(interaction) {
	const status = await isActive();
    if (!status) {
        await  interaction.reply("Server is not active.");
        return;
    }
    let msg = "Server is active: ";
    msg += await getWhich();
	await interaction.reply(msg);
}
