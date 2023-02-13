import { readdirSync } from "node:fs";
import { join } from "node:path";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { Util } from "./util.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (c) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.commands = new Collection();

const __dirname = dirname(fileURLToPath(import.meta.url));

const commandsPath = join(__dirname, "commands");

function addCommands(baseDir, depth) {
	if (depth >= 5) {
		console.warn(`Went too deep while adding commands to client (${baseDir})`);
	}
	baseDir = baseDir || commandsPath;
	depth = depth || 0;
	const commandFiles = readdirSync(baseDir).filter((file) => file.endsWith(".js"));
	const commandDirs = readdirSync(baseDir, { withFileTypes: true })
			.filter((item) => item.isDirectory())
			.map((item) => item.name);

	for (const file of commandFiles) {
		const filePath = join(baseDir, file);
		const command = import(filePath);
		command.then((res) => {
			if (res.data && res.execute) {
				client.commands.set(res.data.name, res);
			} else {
				console.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		});	
	}
	for (const dir of commandDirs) {
		addCommands(`${baseDir}/${dir}`, depth + 1)
	}
}

addCommands();

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
	}
});

const config = Util.getConfig();
client.login(config.token);
