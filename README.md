# discord-voting-games-bot
A bot for Discord that makes ranking/voting games easier to manage and create. Comprises a number of simple media ranking games such as "Upvote/Downvote" "Left or Right", "Rank 1 through 5", "Hug/Kiss/Punch", etc. Automatically creates threads from messages.

When a channel is configured to use this bot, messages without media attachments are automatically deleted; Messages with media attachments are populated automatically with the appropriate reaction emoji (i.e., if the channel's "game mode" is "Upvote/Downvote", the message will automatically have the emojis "⬆️" and "⬇️" applied).

* Available Games (Default game is "Upvote/Downvote". This can be configured by invoking `/set_game_type`):
- Rank 1 through 5
- Rank 1 through 10
- Left or Right
- Left Right or Middle
- Upvote/Downvote
- Hug/Kiss/Punch

By default, additional emojis reactions outside of those posted by the bot are automatically deleted (will be configurable in a later version)
By default, users can only make one emoji reaction selection. This can be configured by invoking `/set_allow_multiple`
By default, threads are automatically created by the bot. This can be configured by invoking `/set_auto_threading`

## Installation Instructions
- `yarn install` to install; `yarn dev` to run in dev mode (hot reloads); `yarn setup` to install and build on a server followed by `yarn start` (or `pm2 start bot_pm2.pson` in pm2 environments)
- TODO: Requires Discord bot token and client ID
- TODO: Describe required channel permissions

## TODO ##
- Short term: Add function to `set_allow_additional` invokation
- Short term: Simple logger with rotation
- Short term: Implement sqlite for storage (currently configurations are in-memory only and reset when bot is run again)
- Mid term: Determine how to best "catch up" any missed messages during down time/outages
- Mid term: Various logic & efficiency improvements
- Mid term: Automatically retrieve current published slash commands and delete/overwrite when necessary
- Long term: Custom emoji selection for games
- Long term: Custom command maker
- Long term: Split out functionality so that individual users can select the "game mode" per message and are not restricted by the channel's configuration
- Long term: Suggest game type by counting number of media attachments
- Long term: (Paid version feature?) Bracket voting system with configurable number of rounds, round durations and expirations, etc.
- Long term: (Paid version feature?) Implement quick and dirty tensorflow implementation to suggest game type based on number of detected dogs, faces, shoes, etc.