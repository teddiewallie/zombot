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
  tail.on('line', (line) => {
    try {
      playerParse(line);
    } catch (e) {}
  });
};

const diedName = (line) => line.split('user ')[1].split(' died at')[0].trim();
const diedCoords = (line) => {
  const coordsRaw = line.split('died at ')[1].split(' (non')[0].replace('(', '').replace(').', '').split(',');
  const coords = `${coordsRaw[0]}x${coordsRaw[1]}x${global.config.zoom}`;
  return coords;
};

const userParse = (line) => {
  try {
    if (line.includes('died')) {
      const name = diedName(line);
      const coords = diedCoords(line);

      const totalDeaths = global.players.persistent.totalDeaths || 0;
      const playerDeaths = global.players.persistent[name].totalDeaths || 0;

      global.players.persistent.totalDeaths = totalDeaths + 1;
      global.players.persistent[name].totalDeaths = playerDeaths + 1;

      send(died(name, coords));
      global.players[name].dead = true;
    }
  } catch (e) {
    console.error(e);
  }
};

const startUserLogTail = async () => {
  const path = await glob(`${global.config.root}/Logs/*user.txt`);
  const tail = new Tail(path[0]);
  tail.on('line', (line) => {
    try {
      userParse(line);
    } catch (e) {}
  });
};

const loginit = () => {
  startUserLogTail();
  startPlayerLogTail();
};

export { loginit };

