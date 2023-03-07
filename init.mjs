import { globalinit } from './global.mjs';
import { loginit } from './logevent.mjs';
import {
  discordjsondumpinit,
  storageinit,
  statusinit
} from './storage.mjs';
import { Client, GatewayIntentBits, ActivityType } from 'discord.js';
import { parse } from './commands.mjs';

import {
  commandFailed,
  discordLoggedIn
} from './dialogue.mjs';

globalinit();

const on = {
  READY: 'ready',
  MESSAGE_CREATE: 'messageCreate'
};

if (!config.debug) {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ]
  });

  client.on(on.READY, () => {
    const { tag } = client.user;
    console.log(discordLoggedIn(tag));
  });

  client.on(on.MESSAGE_CREATE, async (message) => {
    try {
      const isPrefixed = message.content.startsWith(config.prefix);

      if (!isPrefixed || message.author.bot) {
        return;
      }

      const msg = message.content.slice(config.prefix.length);
      const sender = message.author.username;
      console.log(`${sender}: ${msg}`);

      const reply = await parse(msg, sender);
      message.channel.send(reply || '`something died`');
      message.delete();
      console.log(reply.replaceAll('`', '').replaceAll('"', ''));
      console.log('');
    } catch (e) {
      console.error(e);
    }
  });

  await client.login(config.token);
  global.getChannel = async (id) => await client.channels.cache.get(id);
  global.setActivity = async (message) => client.user.setActivity(message, { type: ActivityType.CUSTOM });
}

loginit();
storageinit();
discordjsondumpinit();
statusinit();

