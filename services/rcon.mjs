import config from '../config.json' assert { type: 'json' };

import { Rcon } from 'rcon-client';
import { Logger } from '../helpers/logger.mjs';

const connect = async () => {
  const logger = new Logger('rcon:connect');

  const {
    RCON_HOST,
    RCON_PORT,
    RCON_PASS
  } = config;

  try {
    return await Rcon.connect({ host: RCON_HOST, port: RCON_PORT, password: RCON_PASS });
  } catch (e) {
    logger.error(e);
  }
}

const players = async () => {
  const logger = new Logger('rcon:players');

  let reply = '';

  try {
    const rcon = await connect();
    reply = await rcon.send('players');
    rcon.end();
  } catch (e) {
    logger.error(e);
  }

  reply = reply.split('\n');
  reply = reply.filter((one) => one.includes('-'));
  reply = reply.map((one) => one.replace('-', ''));

  return reply;
}

export {
  players
};
