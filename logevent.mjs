import { Tail } from 'tail';
import { glob } from 'glob';

import { connected, died, disconnected, entering } from './dialogue.mjs';
import { tick } from './player.mjs';
import { seconds } from './utils.mjs';

const on = {
  LINE: 'line',
  FULLY_CONNECTED: 'fully connected',
  DIED: 'died'
};

/*
 * Send a message to the log and to Discord.
 */
const send = async (message) => {
  console.log(message);

  if (!global.config.debug) {
    const { logChannelId } = global.config;
    const channel = await global.getChannel(logChannelId);
    channel?.send(message);
  }
}

/*
 * Get the name of the player.
 */
const name = (line) => line.split(' "')[1].split('" ')[0];

/*
 * Get the coords of the player.
 */
const getCoords = (line) => {
  const coordsRaw = line.split('(')[1].replace(')').split(',');
  const coords = `${coordsRaw[0]}x${coordsRaw[1]}x${global.config.zoom}`;
  return coords;
}

/*
 * Get the name of the player if they have died.
 */
const diedName = (line) => line.split('user ')[1].split(' died at')[0].trim();

/*
 * Get the coords of the player if they have died.
 */
const getDiedCoords = (line) => {
  const coordsRaw = line.split('died at ')[1].split(' (non')[0].replace('(', '').replace(').', '').split(',');
  const coords = `${coordsRaw[0]}x${coordsRaw[1]}x${global.config.zoom}`;
  return coords;
};

/*
 * Parse the player logs.
 */
const playerParse = (line) => {
  const messages = tick(line);
  if (messages.length) {
    messages.forEach((message) => {
      setTimeout(() => send(message), seconds(0.5));
    });
  }
};

/*
 * Start tailing the player logs.
 */
const startPlayerLogTail = async () => {
  const path = await glob(`${global.config.root}/Logs/*player.txt`);
  const tail = new Tail(path[0]);
  tail.on(on.LINE, (line) => {
    try {
      playerParse(line);
    } catch (e) {
      console.error(e);
    }
  });
};

/*
 * Parse the user logs.
 */
const userParse = (line) => {
  const { players } = global;
  const { persistent } = players;
  try {
    if (line.includes(on.FULLY_CONNECTED)) {
      const coords = getCoords(line);
      send(entering(name(line), coords));
    }

    else if (line.includes(on.DIED)) {
      const name = diedName(line);
      const coords = getDiedCoords(line);

      const totalDeaths = persistent.totalDeaths || 0;
      const playerDeaths = persistent[name].totalDeaths || 0;

      persistent.totalDeaths = totalDeaths + 1;
      persistent[name].totalDeaths = playerDeaths + 1;

      send(died(name, coords));
      players[name].dead = true;
    }
  } catch (e) {
    console.error(e);
  }
};

/*
 * Start tailing the user logs.
 */
const startUserLogTail = async () => {
  const path = await glob(`${global.config.root}/Logs/*user.txt`);
  const tail = new Tail(path[0]);
  tail.on(on.LINE, (line) => {
    try {
      userParse(line);
    } catch (e) {}
  });
};

/*
 * Init the logs.
 */
const loginit = () => {
  startUserLogTail();
  startPlayerLogTail();
};

export { loginit };

