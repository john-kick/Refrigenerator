import { SlashCommandBuilder } from "discord.js";
import { createMapFromPicture } from "../../minecraft/picturetomap.js";
import { promises as fs } from "fs";

export const data = new SlashCommandBuilder()
	.setName("mapfrompicture")
	.setDescription("Creates a map from an image")
	.addAttachmentOption((option) => option.setName("image").setDescription("The image to be used").setRequired(true));
export async function execute(interaction) {
    const url = interaction.options.getAttachment("image").url;
    const response = await fetch(url);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile("./temp.png", buffer);

    const index = await createMapFromPicture("./temp.png");

    await fs.rm("./temp.png");

    await interaction.reply("Map successfully created. You can get the map with this command: '/give @p filled_map{map:" + index + "}'.");
}
