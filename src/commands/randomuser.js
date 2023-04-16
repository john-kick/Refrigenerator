import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder().setName("randomuser").setDescription("Chooses a random user from the current voicechat and sends a private message to them.");
export async function execute(interaction) {
    const channelId = interaction.member.voice.channelId;
    if (!channelId) {
        await interaction.reply("You need to be connected to a voice channel to use this command.");
        return;
    }

    const members = await getMembers(interaction, channelId);

    if (members.length < 2) {
        await interaction.reply("At least two people need to be connected to the voice channel.");
        return;
    }

    const fetchOptions = {cache: false, force: true}
    const theChosenOne = members[parseInt(Math.random(members.length) * members.length)];
    const user = await interaction.client.users.fetch(theChosenOne, fetchOptions).catch((err) => console.error(err));
    user.send("You have been chosen!");

	await interaction.reply("Done!");
}

async function getMembers(interaction, channelId) {
    const members = [];
    await interaction.client.channels.fetch(channelId).then((channel) => {
        channel.members.forEach((member) => {
            members.push(member.id);
        });
    });

    return members;
}