import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { commands, handleCommands } from "./commands";
import { handleMessages } from "./messageHandler";
import { getAllowedEmojis, getAllowMultiple } from "./configHandler";

dotenv.config();

const start = () => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessageReactions,
    ],
  });

  client.once("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
  });

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isChatInputCommand()) {
      await handleCommands(interaction);
    }
  });

  client.on("messageCreate", async (message) => {
    await handleMessages(message);
  });

  client.on("messageReactionAdd", async (reaction, user) => {
    if (reaction.partial) {
      // Fetch the full reaction object if it is partial
      try {
        await reaction.fetch();
      } catch (error) {
        console.error(
          "Something went wrong when fetching the reaction:",
          error
        );
        return;
      }
    }

    if (reaction.message.author?.bot) {
      if (reaction.message.content?.includes("Current game type: ")) {
        return;
      }
    }

    // Check if the reaction was added by the user (and not the bot)
    if (user.bot) return;

    // Check if emoji is allowed to be added
    const allowedEmojis = getAllowedEmojis(
      reaction.message.guildId!,
      reaction.message.channelId!
    );

    if (!allowedEmojis.includes(reaction.emoji.name!)) {
      try {
        await reaction.users.remove(user.id);
      } catch (e: any) {
        console.error("Error removing emoji");
      }
    }

    // Get the previous reactions from the message
    const previousReactions = reaction.message.reactions.cache.filter(
      (r) => r.users.cache.has(user.id) && r.emoji.name !== reaction.emoji.name
    );

    const allowMultiple = await getAllowMultiple(
      reaction.message.guildId!,
      reaction.message.channelId!
    );

    if (!allowMultiple) {
      // Remove the allowed emoji
      for (const prevReaction of previousReactions.values()) {
        try {
          await prevReaction.users.remove(user.id); // Remove the user's reaction
        } catch (error) {
          console.error("Error removing previous reaction:", error);
        }
      }
    } else {
      return;
    }
  });

  client.login(process.env.BOT_TOKEN);
};

(async () => {
  console.log(`Running Discord Ranker Bot version ${process.env.APP_VERSION}`);
  if (process.env.BOT_TOKEN && process.env.CLIENT_ID) {
    const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

    try {
      // TODO: Make this do an automatic reset of slash commands if new version
      /*// Deletes all slash commands, emergency use only
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: [],
      });
      console.log("Successfully deleted application (/) commands.");*/

      console.log("Started publishing application (/) commands.");
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: commands,
      });
      console.log("Successfully published application (/) commands.");

      start();
    } catch (error) {
      console.error(error);
    }
  } else {
    console.error(`Missing bot token or client ID`);
  }
})();
