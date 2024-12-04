import { reactionEmojis } from "./reactionEmojis";

// Store settings per guild and channel
const configStore: Record<
  string,
  Record<
    string,
    { autoThreadCreation: boolean; gameType: string; allowMultiple: boolean }
  >
> = {};

function createDefaultGuildConfig(
  guildId: string,
  channelId: string,
  allowMultiple?: boolean,
  autoThreadCreation?: boolean
) {
  configStore[guildId] = {};
  configStore[guildId][channelId] = {
    allowMultiple: allowMultiple ?? false,
    autoThreadCreation: autoThreadCreation ?? true,
    gameType: "updown",
  };
}

function createDefaultChannelConfig(
  guildId: string,
  channelId: string,
  allowMultiple?: boolean,
  autoThreadCreation?: boolean
) {
  configStore[guildId][channelId] = {
    allowMultiple: allowMultiple ?? false,
    autoThreadCreation: autoThreadCreation ?? true,
    gameType: "updown",
  };
}

export function getAllowedEmojis(guildId: string, channelId: string) {
  if (!configStore[guildId]) {
    createDefaultGuildConfig(guildId, channelId);
  }
  return reactionEmojis[configStore[guildId][channelId].gameType].emojis;
}

export function getChannelConfig(guildId: string, channelId: string) {
  if (!configStore[guildId]) {
    createDefaultGuildConfig(guildId, channelId);
  }
  return configStore[guildId][channelId];
}

export function parseChannelConfigFriendly(guildId: string, channelId: string) {
  const config = getChannelConfig(guildId, channelId);

  const s =
    `\n* Current game type: **${
      reactionEmojis[config.gameType].friendlyName
    }**` +
    `\n* Automatic thread creation: **${
      config.autoThreadCreation ? "Enabled" : "Disabled"
    }**` +
    `\n* Allow multiple reactions: **${
      config.allowMultiple ? "Enabled" : "Disabled"
    }**` +
    `\n* Allow additional reactions: **Disabled**`;

  return s;
}

/**
 * Set the allow multiple reactions parameter.
 * @param guildId - The ID of the guild.
 * @param channelId - The ID of the channel.
 * @param enabled - Whether to enable or disable multiple responses.
 */
export async function setAllowMultiple(
  guildId: string,
  channelId: string,
  enabled: boolean
): Promise<void> {
  if (!configStore[guildId]) {
    createDefaultGuildConfig(guildId, channelId, undefined, enabled);
  } else if (!configStore[guildId][channelId]) {
    createDefaultChannelConfig(guildId, channelId, undefined, enabled);
  }

  configStore[guildId][channelId].allowMultiple = enabled;
}

/**
 * Set the auto thread creation for a specific channel in a guild.
 * @param guildId - The ID of the guild.
 * @param channelId - The ID of the channel.
 * @param enabled - Whether to enable or disable auto thread creation.
 */
export async function setAutoThreadCreation(
  guildId: string,
  channelId: string,
  enabled: boolean
): Promise<void> {
  if (!configStore[guildId]) {
    createDefaultGuildConfig(guildId, channelId, enabled, undefined);
  } else if (!configStore[guildId][channelId]) {
    createDefaultChannelConfig(guildId, channelId, enabled, undefined);
  }

  configStore[guildId][channelId].autoThreadCreation = enabled;
}

/**
 * Get the auto thread creation setting for a specific channel in a guild.
 * @param guildId - The ID of the guild.
 * @param channelId - The ID of the channel.
 * @returns The current auto thread creation setting (default is false).
 */
export async function getAutoThreadCreation(
  guildId: string,
  channelId: string
): Promise<boolean> {
  return configStore[guildId]?.[channelId]?.autoThreadCreation ?? false; // Default to false if not set
}

/**
 * Get the reaction type for a specific channel in a guild.
 * @param guildId - The ID of the guild.
 * @param channelId - The ID of the channel.
 * @returns The current reaction type (default is 'Upvote/Downvote').
 */
export async function getReactionType(
  guildId: string,
  channelId: string
): Promise<string> {
  return configStore[guildId]?.[channelId]?.gameType ?? "updown"; // Default to 'Upvote/Downvote' if not set
}

export async function getAllowMultiple(guildId: string, channelId: string) {
  return configStore[guildId]?.[channelId]?.allowMultiple ?? false;
}

/**
 * Set the reaction type for a specific channel in a guild.
 * @param guildId - The ID of the guild.
 * @param channelId - The ID of the channel.
 * @param gameType - The reaction type to set.
 */
export async function setGameType(
  guildId: string,
  channelId: string,
  gameType: string
): Promise<void> {
  if (!configStore[guildId]) {
    createDefaultGuildConfig(guildId, channelId);
  } else if (!configStore[guildId][channelId]) {
    createDefaultChannelConfig(guildId, channelId);
  }

  configStore[guildId][channelId].gameType = gameType;
}
