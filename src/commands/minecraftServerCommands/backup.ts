import { CommandInteraction, ChatInputCommandInteraction, Client, ApplicationCommandType } from "discord.js";
import fs from "fs";
import fse from "fs-extra";
import path from "path";
import { Command } from "../../Command"

export const BackUp: Command = {
	name: "backup",
	description: "Creates a backup of the current minecraft world",
	type: ApplicationCommandType.ChatInput,
	run: async (client: Client, interaction: ChatInputCommandInteraction) => {
		const sourceDir = '/home/andre/server/games/minecraft/1.19.3 survival with the lads/world';
		const backupDirName = ('world_' + new Date().toISOString()).substring(0, 25).replace("T", " ");
		const backupDir = path.join('/home/andre/server/games/minecraft/backup', backupDirName);

		await interaction.followUp(`A backup will be created as ${backupDirName}`);

		fs.mkdirSync(backupDir, { recursive: true });
		fse.copySync(sourceDir, backupDir);

		await interaction.followUp({
			ephemeral: true,
			content: "Backup was created"
		});
	}
}
