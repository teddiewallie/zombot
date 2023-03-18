import config from './config.json' assert { type: 'json' };

import { initCommands } from './commands/_index.mjs';
import { initLogwatch } from './logwatch.mjs';
import { initDatabase } from './database.mjs';
import { initDiscord } from './discord.mjs';

import { players } from './rcon.mjs';
import { Logger } from './logger.mjs';

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

