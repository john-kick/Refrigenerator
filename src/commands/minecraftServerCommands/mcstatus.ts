import { ChatInputCommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { isActive, getWhich } from "../../minecraft/serverStatus"
import { Command } from "../../Command"

export const McStatus: Command = {
    name: "mcstatus",
    description: "Prints the status of the minecraft server",
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        const status = await isActive();
        if (!status) {
            await interaction.followUp("Server is not active.");
            return;
        }

        let msg = "Server is active: ";
        msg += await getWhich();

        await interaction.followUp({
            ephemeral: true,
            content: msg
        });
    }
}
