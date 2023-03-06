import { writeFile } from 'fs';
import { countPlayers } from './rcon.mjs';

const toStorage = (json) => {
  try {
  writeFile('storage.json', JSON.stringify(json), 'utf8', () => {});
  } catch (e) {
    console.error(e);
  }
};

const statusinit = () => {
  setInterval(async () => {
    try {
      const players = await countPlayers();
      const message = `with ${players} 🧍 [${global.players.persistent.totalKills}|${global.players.persistent.totalDeaths}]`;
      console.log(message);
      await global.setActivity(message);
    } catch (e) {
      console.error(e);
    }
  }, 60 * 1000);
};

const storageinit = () => {
  setInterval(() => {
    try {
      const players = global?.players || null;
      const json = { players };
      toStorage(json);
    } catch (e) {
      console.error(e);
    }
  }, 5000);

  setInterval(async () => {
    try {
      if (!global.config.debug) {
        const { debugChannelId } = global.config;
        const channel = await global.getChannel(debugChannelId);
        const string = JSON.stringify({ players: { persistent: global.players.persistent } });
        channel?.send(`Time for a dump. \`\`\`${string}\`\`\``);
      }
    } catch (e) {
      console.error(e);
    }
  }, global.config.jsonDumpIntervalMinutes * 60 * 1000);
};

export { storageinit, statusinit };
