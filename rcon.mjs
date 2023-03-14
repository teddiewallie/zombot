import { Rcon } from 'rcon-client';
import { Logger } from './logger.mjs';

const connect = async () => {
  const logger = new Logger('rcon:connect');

  const {
    RCON_HOST,
    RCON_PORT,
    RCON_PASS
  } = global.config;

  try {
    return await Rcon.connect({ host: RCON_HOST, port: RCON_PORT, password: RCON_PASS });
  } catch (e) {
    logger.error(e);
  }
}

const players = async () => {
  const logger = new Logger('rcon:players');
  
  const rcon = await connect();
  let reply = await rcon.send('players');
  rcon.end();

  reply = reply.split('\n');
  reply = reply.filter((one) => one.includes('-'));
  reply = reply.map((one) => one.replace('-', ''));

  return reply;
}

export {
  players
};
