import {
  ApplicationCommandOptionData,
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  Client
} from "discord.js";
import { sendCommand } from "../../minecraft/mcServerConnector";
import { BaseCommand } from "../BaseCommand";

export default class McCmd extends BaseCommand {
  public name = "mccmd";
  public description = "Sends a command to the Minecraft server";
  public options: ApplicationCommandOptionData[] = [
    {
      name: "command",
      description: "The command to be sent.",
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ];

  public async run(
    client: Client,
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    const command = this.getCommandOption(interaction);

    if (!command) {
      await interaction.followUp({
        ephemeral: true,
        content: "No command specified. Please provide a command to send."
      });
      return;
    }

    try {
      sendCommand(command);
      await interaction.followUp({
        ephemeral: true,
        content: "Command sent successfully!"
      });
    } catch (error) {
      console.error("Error sending command:", error);
      await interaction.followUp({
        ephemeral: true,
        content: "An error occurred while sending the command to the server."
      });
    }
  }

  private getCommandOption(
    interaction: ChatInputCommandInteraction
  ): string | null {
    return interaction.options.getString("command");
  }
}
