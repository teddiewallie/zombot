import config from '../config.json' assert { type: 'json' };

import { Command } from '../helpers/Command.mjs';
import { exec } from 'child_process';
import { Logger } from '../helpers/logger.mjs';
import { blockify } from '../helpers/utils.mjs';

const update = new Command('update', 'update - restarts the server and updates all the mods', async () => {
  const logger = new Logger('commands:update');
  exec(`docker restart ${ZOMBOID_CONTAINER_NAME}`, (error, stdout, stderr) => {
    const TO_DISCORD = true;
    error && logger.info(error, TO_DISCORD);
    stderr && logger.info(stderr, TO_DISCORD);
    stdout && logger.info(stdout, TO_DISCORD);
  });

  return 'Ran the update command and dumped the logs. Check above for info on that.';
});

export { update };

