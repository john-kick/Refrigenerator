import { ChatInputCommandInteraction, Client } from "discord.js";
import { getWhich, isActive } from "../../minecraft/serverStatus";
import { BaseCommand } from "../BaseCommand";

export default class McStatus extends BaseCommand {
  public name = "mcstatus";
  public description = "Displays the current status of the Minecraft server";

  public async run(
    client: Client,
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    try {
      const serverIsActive = await isActive();

      const statusMessage = serverIsActive
        ? `Server is active: ${await getWhich()}`
        : "Server is not active.";

      await interaction.followUp({
        ephemeral: true,
        content: statusMessage
      });
    } catch (error) {
      console.error("Error fetching server status:", error);
      await interaction.followUp({
        ephemeral: true,
        content: "An error occurred while retrieving the server status."
      });
    }
  }
}
