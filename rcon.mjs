import { Rcon } from 'rcon-client';

// import { globalinit } from './global.mjs';
// globalinit();

const cmd = {
  PLAYERS: 'players',
  KICK: (name) => `kick ${name}`,
  SERVERMSG: (
    sender, message
  ) => `servermsg "${sender ? `[(Discord) ${sender}]: ` : ''}${message}"`
};

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
  const reply = await rcon.send(cmd.PLAYERS);
  rcon.end();
  return reply;
};

const kick = async (name) => {
  const rcon = await connect();
  const reply = await rcon.send(cmd.KICK(name));
  rcon.end();
  return reply;
};

const kicktimer = async (name, time) => {
  const playerstring = await players();
  if (playerstring.includes(name)) {
    setTimeout(() => kick(name), time * 60 * 1000);
  }

  const reply = kicktimerMessage(name, time);
  return reply;
};

const countPlayers = async () => {
  const rcon = await connect();
  const reply = await rcon.send(cmd.PLAYERS);
  rcon.end();

  return reply.split(/\r?\n|\r|\n/g).filter((line) => line.includes('-')).length;
};

const servermsg = async (sender, message) => {
  if (!message) {
    return;
  }

  try {
    const rcon = await connect();
    await rcon.send(cmd.SERVERMSG(sender, message));
    rcon.end();

    return statmessage;
  } catch (e) {
    console.error(e);
  }
};

export {
  countPlayers,
  servermsg,
  players,
  kick,
  kicktimer
};

