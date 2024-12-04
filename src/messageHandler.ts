import { Message } from "discord.js";
import { getChannelConfig } from "./configHandler";
import { reactionEmojis } from "./reactionEmojis";

export async function handleMessages(message: Message) {
  if (message.author.bot) return;

  const config = await getChannelConfig(message.guildId!, message.channel.id!);
  if (!config) return;

  // Delete messages without attachments
  if (!message.attachments.size) {
    await message.delete().catch(console.error);
    return;
  }

  if (config.autoThreadCreation) {
    function trimContent(string: string) {
      const MAX_LENGTH = 99;
      return string.length > MAX_LENGTH
        ? string.substring(0, MAX_LENGTH - 3) + "..."
        : string;
    }

    await message
      .startThread({
        name: `${
          message.content.length > 0
            ? trimContent(message.content)
            : `New "${
                reactionEmojis[config.gameType].friendlyName
              }" submission from ${message.author.displayName}`
        }`,
        autoArchiveDuration: 1440,
      })
      .catch(console.error);
  }

  // React with emojis
  const emojis = reactionEmojis[config.gameType || "updown"].emojis;
  for (const emoji of emojis) {
    await message.react(emoji).catch(console.error);
  }
}
