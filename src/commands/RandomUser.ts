import {
  ChatInputCommandInteraction,
  Client,
  CommandInteraction
} from "discord.js";
import { BaseCommand } from "./BaseCommand";

export default class RandomUser extends BaseCommand {
  public name = "randomuser";
  public description =
    "Sends a DM to a randomly chosen user from the current voice channel.";

  public async run(
    client: Client,
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    if (!interaction.guild) {
      return await this.sendEphemeralResponse(
        interaction,
        "Could not find guild."
      );
    }

    const member = interaction.guild.members.cache.get(interaction.user.id);
    if (!member) {
      return await this.sendEphemeralResponse(
        interaction,
        "Could not find calling user."
      );
    }

    const voiceChannelId = member.voice.channelId;
    if (!voiceChannelId) {
      return await this.sendEphemeralResponse(
        interaction,
        "You need to connect to a voice channel to use this command."
      );
    }

    const members = await this.getVoiceChannelMembers(
      interaction,
      voiceChannelId
    );
    if (members.length < 2) {
      return await this.sendEphemeralResponse(
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
      return await this.sendEphemeralResponse(
        interaction,
        "Could not fetch chosen user."
      );
    }

    try {
      await chosenUser.send("You have been chosen!");
      await this.sendEphemeralResponse(interaction, "Done!");
    } catch (error) {
      console.error("Error sending DM:", error);
      await this.sendEphemeralResponse(
        interaction,
        "Could not send a DM to the chosen user."
      );
    }
  }

  private async getVoiceChannelMembers(
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

  private async sendEphemeralResponse(
    interaction: CommandInteraction,
    content: string
  ) {
    await interaction.followUp({ ephemeral: true, content });
  }
}
