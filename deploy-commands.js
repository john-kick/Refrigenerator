import { REST, Routes } from "discord.js";
import fs from "node:fs";
import { Util } from "./util.js";

const commands = [];

async function getFilesToUpdate(baseDir, depth) {
	if (depth >= 5) {
		console.warning(`Went too deep while looking for commands (${baseDir})`)
		return;
	}
	baseDir = baseDir || './commands';
	depth = depth || 0;
	const commandFiles = fs.readdirSync(`${baseDir}`).filter((file) => file.endsWith(".js"));
	const dirs = fs.readdirSync(baseDir, { withFileTypes: true })
		.filter((item) => item.isDirectory())
		.map((item) => item.name);
	for (const file of commandFiles) {
		const command = await import(`./${baseDir}/${file}`);
		commands.push(command.data.toJSON());
	}
	for (const dir of dirs) {
		await getFilesToUpdate(`${baseDir}/${dir}`, depth+1);
	}
	if (depth === 0) {
		sendUpdate();
	}
}

const config = Util.getConfig();
const rest = new REST({ version: "10" }).setToken(config.token);

async function sendUpdate() {
	try {
		console.log(`Started refreshing ${commands.length} commands.`);

		const data = await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commands });

		console.log(`Successfully reloaded ${data.length} commands.`);
	} catch (error) {
		console.error(error);
	}
};

getFilesToUpdate();
