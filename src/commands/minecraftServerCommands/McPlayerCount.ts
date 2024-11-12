import { ChatInputCommandInteraction, Client } from "discord.js";
import { isActive, playerCount } from "../../minecraft/serverStatus";
import { BaseCommand } from "../BaseCommand";

export default class McPlayerCount extends BaseCommand {
  public name = "mcplayercount";
  public description = "Displays the number of players currently on the server";

  public async run(
    client: Client,
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    try {
      const serverIsActive = await isActive();

      if (!serverIsActive) {
        await interaction.followUp({
          ephemeral: true,
          content:
            "The server is not currently running, so no player count is available."
        });
        return;
      }

      const count = await playerCount();
      await interaction.followUp({
        ephemeral: true,
        content: `Connected players: ${count}`
      });
    } catch (error) {
      console.error("Error fetching server status or player count:", error);
      await interaction.followUp({
        ephemeral: true,
        content: "An error occurred while retrieving the player count."
      });
    }
  }
}
