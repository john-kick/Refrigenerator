import { ChatInputCommandInteraction, Client } from "discord.js";
import { Commands } from "../Commands";

export default (client: Client): void => {
    // todo: FIX THIS SHITE!
    client.on("interactionCreate", async (interaction: ChatInputCommandInteraction) => {
        if (interaction.isCommand()) {
            await handleSlashCommand(client, interaction);
        }
    });
};

const handleSlashCommand = async (client: Client, interaction: ChatInputCommandInteraction): Promise<void> => {
    const slashCommand = Commands.find(c => c.name === interaction.commandName);
    if (!slashCommand) {
        interaction.followUp({ content: "An error has occurred" });
        return;
    }

    await interaction.deferReply();

    slashCommand.run(client, interaction);
}; 