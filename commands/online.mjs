import { Command } from '../Command.mjs';
import { handleStringArray } from '../utils.mjs';
import { players } from '../rcon.mjs';

const online = new Command(
  'online',
  'online - List online players',
  async() => {
    const rconPlayers = await players();
    if (!players.length) {
      return 'No players online.';
    } else {
      return handleStringArray(await players())
    }
  }
);

export { online };

