import { ChatInputCommandInteraction, Client } from "discord.js";
import { BaseCommand } from "./BaseCommand";

export default class Ping extends BaseCommand {
  public name = "ping";
  public description = "Answers Pong!";

  public async run(
    _client: Client,
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    await interaction.followUp({
      ephemeral: true,
      content: "Pong!"
    });
  }
}
