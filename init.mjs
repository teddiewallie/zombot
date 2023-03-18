import config from './config.json' assert { type: 'json' };

import { initLogwatch } from './services/logwatch.mjs';
import { initDatabase } from './services/database.mjs';
import { initDiscord } from './services/discord.mjs';
import { players } from './services/rcon.mjs';

import { initCommands } from './commands/_index.mjs';
import { Logger } from './helpers/logger.mjs';

const init = async () => {
  global.init = {};
  const logger = new Logger('init:init');

  try {
    logger.info('initCommands()');
    await initCommands();
    global.init.COMMANDS = true;
  } catch (e) {
    logger.error(e);
    !global.init.COMMANDS && setTimeout(initCommands, config.FILEWAIT_MS);
  }

  try {
    logger.info('initDatabase()');
    await initDatabase();
    global.init.DATABASE = true;
  } catch (e) {
    logger.error(e);
    !global.init.DATABASE && setTimeout(initDatabase, config.FILEWAIT_MS);
  }

  try {
    logger.info('initLogwatch()');
    await initLogwatch();
    global.init.LOGWATCH = true;
  } catch (e) {
    logger.error(e);
    !global.init.LOGWATCH && setTimeout(initLogwatch, config.FILEWAIT_MS);
  }

  try {
    logger.info('initDiscord()');
    await initDiscord();
    global.init.DISCORD = true;
  } catch (e) {
    logger.error(e);
    !global.init.DISCORD && setTimeout(initDiscord, config.FILEWAIT_MS);
  }
};

init();

