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

const servermsg = async (sender, message) => {
  if (!message) {
    return;
  }

  const rcon = await connect();
  const statmessage = `"${sender ? `[(Discord) ${sender}]: ` : ''}${message}"`;
  await rcon.send(`servermsg ${statmessage}`);
  rcon.end();

  return statmessage;
};

export {
  servermsg
}

