import { Message } from "discord.js";

const TARGET_CHANNEL_ID = "1071777668149813388";

export default function run(message: Message): void {
  // Ignore messages from the bot itself
  if (message.author.bot) return;

  // Check if the message is in the specified channel
  if (message.channel.id === TARGET_CHANNEL_ID) {
    if (!message.member) {
      console.error("No member attached to message");
      return;
    }

    const oldName = message.member.nickname ?? message.member.user.displayName;

    // check if the sender's nickname already has "(stupid)" at the end
    if (oldName.endsWith(" (stupid)")) {
      return;
    }

    // Append "(stupid)" to the sender's nickname
    message.member
      .setNickname(oldName + " (stupid)")
      .then((_member) => {
        console.log(`Made ${oldName} stupid!`);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
