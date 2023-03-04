import { Tail } from 'tail';
import { glob } from 'glob';

import { connected, died, disconnected } from './dialogue.mjs';
import { tick } from './player.mjs';

const send = async (message) => {
  console.log(message);

  if (global.config.debug) {
    return;
  }

  const { logChannelId } = global.config;

  const channel = await global.getChannel(logChannelId);
  channel?.send(message);
}

const name = (line, offset) => line.split(' "')[1].split('" ')[0];

const playerParse = (line) => {
  /*if (line.includes('connected')) {
    send(connected(name(line)));
    return;
  }*/

  const messages = tick(line);
  if (messages.length) {
    messages.forEach((message) => {
      setTimeout(() => send(message), 500);
    });
  }
};

const startPlayerLogTail = async () => {
  const path = await glob(`${global.config.root}/Logs/*player.txt`);
  const tail = new Tail(path[0]);
  tail.on('line', (line) => playerParse(line));
};

const diedName = (line) => line.split('user ')[1].split(' died at')[0].trim();

const userParse = (line) => {
  if (line.includes('died')) {
    const name = diedName(line);
    send(died(name));
    global.players[name] = null;
  }
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

