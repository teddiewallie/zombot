import config from './config.json' assert { type: 'json' };
global.config = config;

import { initLogwatch } from './logwatch.mjs';
import { initDatabase } from './database.mjs';
import { initDiscord } from './discord.mjs';

import { players } from './rcon.mjs';
import { Logger } from './logger.mjs';

const init = async () => {
  const logger = new Logger('init:init');
  logger.info('initDatabase()');
  await initDatabase();

  logger.info('initLogwatch()');
  await initLogwatch();

  logger.info('initDiscord()');
  await initDiscord();
};

init();

