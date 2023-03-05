import { Rcon } from 'rcon-client';

// import { globalinit } from './global.mjs';
// globalinit();



const connect = async () => {
  const {
    rconhost: host,
    rconpass: password,
    rconport: port
  } = global.config;

  return await Rcon.connect({ host, port, password });
}

const players = async () => {
  const rcon = await connect();
  const reply = await rcon.send('players');
  rcon.end();
  return reply;
};

const countPlayers = async () => {
  const rcon = await connect();
  const reply = await rcon.send('players');
  rcon.end();

  return reply.split(/\r?\n|\r|\n/g).filter((line) => line.includes('-')).length;
};

const servermsg = async (sender, message) => {
  if (!message) {
    return;
  }

  try {
    const rcon = await connect();
    const statmessage = `"${sender ? `[(Discord) ${sender}]: ` : ''}${message}"`;
    await rcon.send(`servermsg ${statmessage}`);
    rcon.end();

    return statmessage;
  } catch (e) {
    console.error(e);
  }
};

export {
  countPlayers,
  servermsg,
  players
}

