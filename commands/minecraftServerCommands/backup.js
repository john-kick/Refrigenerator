import { SlashCommandBuilder } from "discord.js";
import fs from "fs";
import fse from "fs-extra";
import path from "path";

export const data = new SlashCommandBuilder()
	.setName("backup")
	.setDescription("Creates a backup of the current minecraft world");
export async function execute(interaction) {
    const sourceDir = '/home/andre/server/games/minecraft/1.19.3 survival with the lads/world';
    const backupDirName = ('world_' + new Date().toISOString()).substring(0, 25).replace("T", " ");
    const backupDir = path.join('/home/andre/server/games/minecraft/backup', backupDirName);

    await interaction.reply(`A backup will be created as ${backupDirName}`);

    fs.mkdirSync(backupDir, { recursive: true });
    fse.copySync(sourceDir, backupDir);

    await interaction.followUp("Backup was created");
}
