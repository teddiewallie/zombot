import { writeFile } from 'fs';
import { countPlayers } from './rcon.mjs';
import { dumpMessage, statusMessage } from './dialogue.mjs';
import { seconds, minutes, UTF8 } from './utils.mjs';

/*
 * Write to the storage file.
 */
const toStorage = (json) => {
  try {
  writeFile(global.config.storagePath, JSON.stringify(json), UTF8, () => {});
  } catch (e) {
    console.error(e);
  }
};

/*
 * Start the intervaller for the storage writer.
 */
const storageinit = () => {
  setInterval(() => {
    try {
      const players = global?.players || null;
      const json = { players };
      toStorage(json);
    } catch (e) {
      console.error(e);
    }
  }, seconds(global.config.storageDumpIntervalSeconds));
};

/*
 * Start the intervaller for the status updates.
 */
const statusinit = () => {
  setInterval(async () => {
    try {
      const { totalKills, totalDeaths } = global.players.persistent;
      const players = await countPlayers();

      const message = statusMessage(players, totalKills, totalDeaths);

      console.log(message);
      await global.setActivity(message);
    } catch (e) {
      console.error(e);
    }
  }, minutes(global.config.discordStatusUpdateIntervalMinutes));
};

/*
 * Start the intervaller for the Discord json dumper.
 */
const discordjsondumpinit = () => {
  setInterval(async () => {
    try {
      if (!global.config.debug) {
        const { debugChannelId } = global.config;
        const channel = await global.getChannel(debugChannelId);
        const string = JSON.stringify({ players: { persistent: global.players.persistent } });
        channel?.send(dumpMessage(string));
      }
    } catch (e) {
      console.error(e);
    }
  }, minutes(global.config.discordJsonDumpIntervalMinutes));
};

export { storageinit, statusinit, discordjsondumpinit };

