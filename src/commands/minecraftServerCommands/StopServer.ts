import { ChatInputCommandInteraction, Client } from "discord.js";
import * as fs from "fs/promises";
import * as fse from "fs-extra";
import moment from "moment";
import * as path from "path";
import { stopServer } from "../../minecraft/mcServerConnector";
import { playerCount } from "../../minecraft/serverStatus";
import { BaseCommand } from "../BaseCommand";

export default class StopServer extends BaseCommand {
  public name = "stopserver";
  public description = "Stops the Minecraft server";

  private sourceDir =
    "/home/andre/server/games/minecraft/1.19.3 survival with the lads/world";
  private backupBaseDir = "/home/andre/server/games/minecraft/backup";

  public async run(
    client: Client,
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    try {
      const connectedPlayers = await playerCount();

      if (connectedPlayers > 0) {
        await interaction.followUp({
          ephemeral: true,
          content:
            "There is at least one person connected to the server. Please wait until the server is empty before shutting down."
        });
        return;
      }

      stopServer();
      await interaction.followUp("Stopping server. A backup will be created.");

      const backupDirPath = this.getBackupDirectoryPath();
      await this.createBackup(backupDirPath);

      await interaction.followUp({
        ephemeral: true,
        content: "Server stopped and backup created successfully."
      });
    } catch (error) {
      console.error("Error stopping server or creating backup:", error);
      await interaction.followUp({
        ephemeral: true,
        content:
          "An error occurred while stopping the server or creating the backup."
      });
    }
  }

  private getBackupDirectoryPath(): string {
    const backupDirName = `world_${moment().format("YYYY-MM-DD_HH-mm-ss")}`;
    return path.join(this.backupBaseDir, backupDirName);
  }

  private async createBackup(backupDirPath: string): Promise<void> {
    await fs.mkdir(backupDirPath, { recursive: true });
    await fse.copy(this.sourceDir, backupDirPath);
    console.log(`Backup created at ${backupDirPath}`);
  }
}
