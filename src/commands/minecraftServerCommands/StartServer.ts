import { ChatInputCommandInteraction, Client } from "discord.js";
import { startServer } from "../../minecraft/mcServerConnector";
import { isActive } from "../../minecraft/serverStatus";
import { BaseCommand } from "../BaseCommand";

export default class StartServer extends BaseCommand {
  public name = "startserver";
  public description = "Starts the Minecraft server";

  public async run(
    client: Client,
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    try {
      const serverIsActive = await isActive();

      if (serverIsActive) {
        await interaction.reply({
          ephemeral: true,
          content:
            "A server is already online. Use the /mcstatus command to check the current server status."
        });
        return;
      }

      await startServer();
      await interaction.followUp({
        ephemeral: true,
        content: "Starting server. Please wait a few seconds for it to start."
      });
    } catch (error) {
      console.error("Error starting server:", error);
      await interaction.followUp({
        ephemeral: true,
        content: "An error occurred while attempting to start the server."
      });
    }
  }
}
