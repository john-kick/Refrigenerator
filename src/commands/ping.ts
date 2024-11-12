import { CommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { Command } from "../Command";

export const Ping: Command = {
  name: "ping",
  description: 'Answers Pong!"',
  type: ApplicationCommandType.ChatInput,
  run: ping,
};

async function ping(client: Client, interaction: CommandInteraction) {
  const content = "Pong!";

  await interaction.followUp({
    ephemeral: true,
    content,
  });
}
