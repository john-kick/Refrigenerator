import { SlashCommandBuilder } from "discord.js";
import { createMapFromPicture } from "../../minecraft/picturetomap.js";
import { promises as fs } from "fs";

export const data = new SlashCommandBuilder()
	.setName("mapfrompicture")
	.setDescription("Creates a map from an image")
	.addAttachmentOption((option) => option.setName("image").setDescription("The image to be used").setRequired(true))
    .addBooleanOption((option) => option.setName("divide").setDescription("Should the image be divided into multiple maps? Useful to create larger images in-game.").setRequired(false))
    .addIntegerOption((option) => option.setName("width").setDescription("Only needed if \"divide\" = true. Sets the amount of maps per row.").setRequired(false))
    .addIntegerOption((option) => option.setName("height").setDescription("Only needed if \"divide\" = true. Sets the amount of maps per column.").setRequired(false));
export async function execute(interaction) {
    await interaction.reply("This might take a second...");
    const url = interaction.options.getAttachment("image").url;
    const response = await fetch(url);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile("./temp.png", buffer);

    const divide = interaction.options.getBoolean("divide");
    const width = interaction.options.getInteger("width");
    const height = interaction.options.getInteger("height");

    let result = await createMapFromPicture("./temp.png", divide, width, height);

    if (result.substring(0, 7) === "/summon") {
        interaction.followUp("Creating multiple maps. Make sure to have enough inventory space before executing the command (" + (width * height) + "). You probably need a command block as well.");
        if (result.length > 2000) {
            await interaction.followUp("Maps successfully created. The command is longer than 2000 characters, so you need to copy/paste it in chunks");
            while (result.length > 0) {
                await interaction.followUp("```"+ result.substring(0, 1994) +"```");
                result = result.substring(1994);
            }
        } else {
            await interaction.followUp("Maps successfully created. You can get the maps with the following command: \n```" + result + "```");
        }
    } else {
        await interaction.followUp("Map(s) successfully created. You can get the map with this command: ```" + result + "```.");
    }

    await fs.rm("./temp.png");
}
