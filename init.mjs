import config from './config.json' assert { type: 'json' };

global.config = config;
global.players = {};

import { loginit } from './logevent.mjs';
import { Client, GatewayIntentBits } from 'discord.js';
import { parse } from './commands.mjs';

if (!config.debug) {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ]
  });

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on('messageCreate', (message) => {
    const isPrefixed = message.content.startsWith(config.prefix);

    if (!isPrefixed || message.author.bot) {
      return;
    }

    const msg = message.content.slice(config.prefix.length);
    message.channel.send(parse(msg));
  });

  await client.login(config.token);
  global.getChannel = async (id) => await client.channels.cache.get(id);
}

loginit();
