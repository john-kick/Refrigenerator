import { ApplicationCommandType, Client, CommandInteraction } from "discord.js";
import { Command } from "../Command";

export const RandomUser: Command = {
  name: "randomuser",
  description:
    "Sends a DM to a randomly chosen user from the current voice channel.",
  type: ApplicationCommandType.ChatInput,
  run: chooseRandomUser,
};

async function chooseRandomUser(
  client: Client,
  interaction: CommandInteraction
): Promise<void> {
  if (!interaction.guild) {
    return await sendEphemeralResponse(interaction, "Could not find guild.");
  }

  const member = interaction.guild.members.cache.get(interaction.user.id);
  if (!member) {
    return await sendEphemeralResponse(
      interaction,
      "Could not find calling user."
    );
  }

  const voiceChannelId = member.voice.channelId;
  if (!voiceChannelId) {
    return await sendEphemeralResponse(
      interaction,
      "You need to connect to a voice channel to use this command."
    );
  }

  const members = await getVoiceChannelMembers(interaction, voiceChannelId);
  if (members.length < 2) {
    return await sendEphemeralResponse(
      interaction,
      "At least two people need to be connected to the voice channel."
    );
  }

  const chosenMemberId = members[Math.floor(Math.random() * members.length)];
  const chosenUser = await client.users.fetch(chosenMemberId).catch((err) => {
    console.error("Error fetching chosen user:", err);
    return null;
  });

  if (!chosenUser) {
    return await sendEphemeralResponse(
      interaction,
      "Could not fetch chosen user."
    );
  }

  try {
    await chosenUser.send("You have been chosen!");
    await sendEphemeralResponse(interaction, "Done!");
  } catch (error) {
    console.error("Error sending DM:", error);
    await sendEphemeralResponse(
      interaction,
      "Could not send a DM to the chosen user."
    );
  }
}

// Helper function to get members in a voice channel
async function getVoiceChannelMembers(
  interaction: CommandInteraction,
  channelId: string
): Promise<string[]> {
  const channel = await interaction.client.channels
    .fetch(channelId)
    .catch((err) => {
      console.error("Error fetching channel:", err);
      return null;
    });

  if (!channel || !channel.isVoiceBased()) {
    console.error("Channel not found or is not a voice channel.");
    return [];
  }

  return Array.from(channel.members.keys());
}

// Helper function to send ephemeral responses
async function sendEphemeralResponse(
  interaction: CommandInteraction,
  content: string
) {
  await interaction.followUp({ ephemeral: true, content });
}
