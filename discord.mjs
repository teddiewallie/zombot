import { Client, GatewayIntentBits, ActivityType } from 'discord.js';
import { codify, spacer } from './utils.mjs';
import { players } from './rcon.mjs';
import { commands } from './commands.mjs';
import { Logger } from './logger.mjs';

const initDiscord = async () => {
  const {
    TOKEN,
    PREFIX
  } = global.config;

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ]
  });

  client.on('ready', () => {
    const logger = new Logger('discord:discordInit:ready');
    logger.info(`Logged in as ${client.user.tag}!`);
  });

  client.on('messageCreate', async (message) => {
    const logger = new Logger('discord:discordInit:messageCreate');
    try {
      const isPrefixed = message.content.startsWith(PREFIX);

      if (!isPrefixed || message.author.bot) {
        return;
      }

      const msg = message.content.slice(PREFIX.length);
      const sender = message.author.username;

      const msgParts = msg.split(' ');
      const command = msgParts.shift();

      const pretext = codify(`[${sender}](${PREFIX}${command}${msgParts.length ? ` ${msgParts.join(' ')}` : ''})`);
      let reply = `${pretext} I didn't quite catch that. Sorry.`;
      let commandResponse = '';

      if (Object.keys(commands).includes(command)) {
        commandResponse = `${await commands[command](msgParts.join(' '))}`;
        reply = `${pretext} ${commandResponse}`;
      }

      logger.info(`[${sender}]${spacer(15 - sender.length)}${msg}`);

      message.channel.send(reply);
      message.delete();
      logger.info(`[zombot]${spacer(9)}${pretext.replaceAll('`', '').replaceAll('"', '')}\n${commandResponse.replaceAll('`', '').replaceAll('"', '')}`);
    } catch (e) {
      console.error(e);
    }
  });

  await client.login(TOKEN);
  global.getChannel = async (id) => await client.channels.cache.get(id);
  global.setActivity = async (message) => client.user.setActivity(message, { type: ActivityType.CUSTOM });
};

export {
  initDiscord
};

