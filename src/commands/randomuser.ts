import { CommandInteraction, Client, ApplicationCommandType, GuildMember } from "discord.js";
import { Command } from "../Command"

export const RandomUser: Command = {
	name: "randomuser",
	description: "Sends a dm to a randomly chosen user from the current voice channel.",
	type: ApplicationCommandType.ChatInput,
	run: async (client: Client, interaction: CommandInteraction) => {
        if (!interaction.guild) {
            await interaction.followUp({
                ephemeral: true,
                content: "Could not find guild."
            });
            console.error("Could not find guild.");
            return;
        }
		const userId = interaction.user.id;
        const member = interaction.guild.members.cache.get(userId);
        console.log(member)
        if (!member) {
            await interaction.followUp({
                ephemeral: true,
                content: "Could not find calling user."
            });
            console.error("Could not find calling user.");
            return;
        }
        console.log(member.voice);
        const channelId = member.voice.channelId;
        if (!channelId) {
            await interaction.followUp({
                ephemeral: true,
                content: "You need to connect to a voice channel to use this command."
            });
            return;
        }

        const members = await getMembers(interaction, channelId);

        if (members.length < 2) {
            await interaction.followUp({
                ephemeral: true,
                content: "At least two people need to be connected to the voice channel."
            });
            return;
        }

        const fetchOptions = {cache: false, force: true}
        const theChosenOne = members[Math.random() * members.length];
        const user = await interaction.client.users.fetch(theChosenOne, fetchOptions).catch((err) => console.error(err));
        if (!user) {
            console.error("Could not fetch chosen user");
            await interaction.followUp({
                ephemeral: true,
                content: "Could not fetch chosen user"
            });
            return;
        }
        user.send("You have been chosen!");
        
		await interaction.followUp({
			ephemeral: true,
			content: "Done!"
		});
	}
}

async function getMembers(interaction: CommandInteraction, channelId: string): Promise<string[]> {
    const members: string[] = [];
    await interaction.client.channels.fetch(channelId).then((channel) => {
        if (!channel) {
            console.error("Cannot get current channel");
            return;
        }
        if (channel.isVoiceBased()) {
            channel.members.forEach((member: GuildMember) => {
                members.push(member.id);
            })
        }
        
    })
    return members;
}

// import { SlashCommandBuilder } from "discord.js";

// export const data = new SlashCommandBuilder().setName("randomuser").setDescription("Chooses a random user from the current voicechat and sends a private message to them.");
// export async function execute(interaction) {
//     const channelId = interaction.member.voice.channelId;
//     if (!channelId) {
//         await interaction.reply("You need to be connected to a voice channel to use this command.");
//         return;
//     }

//     const members = await getMembers(interaction, channelId);

//     if (members.length < 2) {
//         await interaction.reply("At least two people need to be connected to the voice channel.");
//         return;
//     }

//     const fetchOptions = {cache: false, force: true}
//     const theChosenOne = members[parseInt(Math.random(members.length) * members.length)];
//     const user = await interaction.client.users.fetch(theChosenOne, fetchOptions).catch((err) => console.error(err));
//     user.send("You have been chosen!");

// 	await interaction.reply("Done!");
// }

// async function getMembers(interaction, channelId) {
//     const members = [];
//     await interaction.client.channels.fetch(channelId).then((channel) => {
//         channel.members.forEach((member) => {
//             members.push(member.id);
//         });
//     });

//     return members;
// }