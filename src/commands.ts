import { ChatInputCommandInteraction } from "discord.js/typings";
import { SlashCommandBuilder } from "@discordjs/builders";
import {
  parseChannelConfigFriendly,
  setAllowMultiple,
  setAutoThreadCreation,
  setGameType,
} from "./configHandler";
import { reactionEmojis } from "./reactionEmojis";

export const commands = [
  new SlashCommandBuilder()
    .setName("set_game_type")
    .setDescription("Set the game type for the current channel.")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Game type")
        .addChoices(
          { name: "Rate 1 through 5", value: "r1to5" },
          { name: "Rate 1 through 10", value: "r1to10" },
          { name: "Left or Right", value: "lr" },
          { name: "Left, Middle, or Right", value: "lmr" },
          { name: "Hug/Kiss/Punch", value: "hkp" },
          { name: "Upvote/Downvote", value: "updown" }
        )
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("set_auto_threading")
    .setDescription(
      "Enable or disable automatic thread creation for submissions."
    )
    .addBooleanOption((option) =>
      option
        .setName("enabled")
        .setDescription("Enable or disable auto thread creation")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("set_allow_multiple")
    .setDescription("Enable or disable multiple emoji reactions.")
    .addBooleanOption((option) =>
      option
        .setName("enabled")
        .setDescription("Enable or disable multiple reactions")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("set_allow_additional")
    .setDescription(
      "Enable or disable additional emoji reactions beyond the scope of the current game."
    )
    .addBooleanOption((option) =>
      option
        .setName("enabled")
        .setDescription("Enable or disable additional reactions")
        .setRequired(true)
    ),
];

export async function handleCommands(interaction: ChatInputCommandInteraction) {
  switch (interaction.commandName) {
    case "set_allow_multiple":
      const multiple_enabled = interaction.options.getBoolean("enabled");
      if (multiple_enabled !== null) {
        await setAllowMultiple(
          interaction.guildId!,
          interaction.channelId!,
          multiple_enabled
        );

        await interaction.reply({
          content: `*Multiple responses have been ${
            multiple_enabled ? "enabled" : "disabled"
          }*.${parseChannelConfigFriendly(
            interaction.guildId!,
            interaction.channelId!
          )}`,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content:
            "Please provide a valid value for auto thread creation (true or false).",
          ephemeral: true,
        });
      }
      break;
    case "set_auto_threading":
      const enabled = interaction.options.getBoolean("enabled");

      if (enabled !== null) {
        await setAutoThreadCreation(
          interaction.guildId!,
          interaction.channelId!,
          enabled
        );

        await interaction.reply({
          content: `*Automatic thread creation has been ${
            enabled ? "enabled" : "disabled"
          }*.${parseChannelConfigFriendly(
            interaction.guildId!,
            interaction.channelId!
          )}`,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content:
            "Please provide a valid value for auto thread creation (true or false).",
          ephemeral: true,
        });
      }
      break;
    case "set_game_type":
      const gameType = interaction.options.getString("type", true);
      await setGameType(interaction.guildId!, interaction.channelId!, gameType);
      await interaction.reply({
        content: `*Game type changed to ${
          reactionEmojis[gameType].friendlyName
        }*.${parseChannelConfigFriendly(
          interaction.guildId!,
          interaction.channelId!
        )}`,
        ephemeral: true,
      });
      break;
    default:
      await interaction.reply({
        content: `You have attempted to access a command "${
          interaction.commandName ?? "Unknown"
        }" that has not yet been implemented.`,
        ephemeral: true,
      });
      break;
  }
}
