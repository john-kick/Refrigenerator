import { ChatInputCommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { playerCount } from "../../minecraft/serverStatus";
import { stopServer } from "../../minecraft/mcServerConnector";
import { Command } from "../../Command";
import * as path from "path";
import * as fs from "fs";
import * as fse from "fs-extra";
import moment from "moment";

export const StopServer: Command = {
	name: "stopserver",
	description: "Stops the minecraft server",
	type: ApplicationCommandType.ChatInput,
	run: async (client: Client, interaction: ChatInputCommandInteraction) => {
		if (await playerCount() > 0) {
			await interaction.followUp("There is at least one person connected to the server. Please wait until the server is empty before shutting down.");
			return;
		}

		stopServer();
		await interaction.followUp("Stopping server. A backup will be created.");

		const sourceDir = "/home/andre/server/games/minecraft/1.19.3 survival with the lads/world";
		const backupDirName = "world_" + moment().format("YYYY-MM-DD HH-mm-ss");
		const backupDir = path.join("/home/andre/server/games/minecraft/backup", backupDirName);

		try {
			fs.mkdirSync(backupDir, { recursive: true });
			fse.copySync(sourceDir, backupDir);
			console.log(`Backup created at ${backupDir}`);
		} catch (error) {
			console.error("Failed to create backup");
		}

		await interaction.followUp({
			ephemeral: true,
			content: "Starting server. Please wait a few seconds for it to start."
		});
	}
}

// import { SlashCommandBuilder } from "discord.js";
// import { stopServer } from "../../minecraft/mcServerConnector.js";
// import { playerCount } from "../../minecraft/serverStatus.js";
// import path from "path";
// import fs from "fs";
// import fse from "fs-extra";
// import moment from "moment";

// export const data = new SlashCommandBuilder()
//   .setName("stopserver")
//   .setDescription("Stops the minecraft server");

// export async function execute(interaction) {
//   if (await playerCount() > 0) {
//     await interaction.reply("There is at least one person connected to the server. Please wait until the server is empty before shutting down.");
//     return;
//   }

//   stopServer();
//   await interaction.reply("Stopping server. A backup will be created.");

//   const sourceDir = "/home/andre/server/games/minecraft/1.19.3 survival with the lads/world";
//   const backupDirName = "world_" + moment().format("YYYY-MM-DD HH-mm-ss");
//   const backupDir = path.join("/home/andre/server/games/minecraft/backup", backupDirName);

//   try {
//     fs.mkdirSync(backupDir, { recursive: true });
//     fse.copySync(sourceDir, backupDir);
//     console.log(`Backup created at ${backupDir}`);
//   } catch (error) {
//     console.error(`Failed to create backup: ${error.message}`);
//   }
// }
