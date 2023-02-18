import { REST, Routes } from "discord.js";
import fs from "node:fs";
import { Util } from "./util.js";

const commands = [];
const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));

async function getFilesToUpdate() {
	for (const file of commandFiles) {
		const command = await import(`./commands/${file}`);
		commands.push(command.data.toJSON());
	}
}

const config = Util.getConfig();

const rest = new REST({ version: "10" }).setToken(config.token);

async function sendUpdate() {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), {
			body: commands
		});

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
}

(async () => {
	await getFilesToUpdate();
	sendUpdate();
})();
