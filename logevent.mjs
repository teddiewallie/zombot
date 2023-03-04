import { Tail } from 'tail';
import { glob } from 'glob';

import { connected, disconnected } from './dialogue.mjs';

const send = async (message) => {
  const { debug } = global.config;
  console.log(message);

  if (debug) {
    return;
  }

  const { logChannelId } = global.config;

  const channel = await global.getChannel(logChannelId);
  channel?.send(message);
}

const name = (line) => line.split(' "')[1].split('" ')[0];

const playerParse = (line) => {
  if (!line.includes('connected')) {
    return;
  }

  // TODO: cache the perks

  send(connected(name(line)));
};

const userParse = (line) => {
  line.includes('disconnected') && send(disconnected(name(line))); // TODO: check if player is online before sending this
};

const startPlayerLogTail = async () => {
  const path = await glob(`${global.config.root}/Logs/*player.txt`);
  const tail = new Tail(path[0]);
  tail.on('line', (line) => playerParse(line));
};

const startUserLogTail = async () => {
  const path = await glob(`${global.config.root}/Logs/*user.txt`);
  const tail = new Tail(path[0]);
  tail.on('line', (line) => userParse(line));
};

const loginit = () => {
  startUserLogTail();
  startPlayerLogTail();
};

export { loginit };

