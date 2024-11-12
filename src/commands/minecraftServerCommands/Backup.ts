import { ChatInputCommandInteraction, Client } from "discord.js";
import fs from "fs/promises";
import fse from "fs-extra";
import path from "path";
import { BaseCommand } from "../BaseCommand";

export default class Backup extends BaseCommand {
  public name = "backup";
  public description = "Creates a backup of the current Minecraft world";

  private sourceDir =
    "/home/andre/server/games/minecraft/1.19.3 survival with the lads/world";
  private backupBaseDir = "/home/andre/server/games/minecraft/backup";

  public async run(
    client: Client,
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    const backupDirName = this.generateBackupDirName();
    const backupDirPath = path.join(this.backupBaseDir, backupDirName);

    await interaction.followUp(`Creating backup as ${backupDirName}...`);

    try {
      await this.createBackupDirectory(backupDirPath);
      await fse.copy(this.sourceDir, backupDirPath);

      await interaction.followUp({
        ephemeral: true,
        content: "Backup successfully created!"
      });
    } catch (error) {
      console.error("Error during backup:", error);
      await interaction.followUp({
        ephemeral: true,
        content: "An error occurred while creating the backup."
      });
    }
  }

  private generateBackupDirName(): string {
    return `world_${new Date()
      .toISOString()
      .substring(0, 19)
      .replace("T", "_")}`;
  }

  private async createBackupDirectory(backupDirPath: string): Promise<void> {
    await fs.mkdir(backupDirPath, { recursive: true });
  }
}
