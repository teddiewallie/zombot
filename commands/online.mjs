import { Command } from '../helpers/Command.mjs';
import { handleStringArray } from '../helpers/utils.mjs';
import { players } from '../services/rcon.mjs';

const online = new Command(
  'online',
  'online - List online players',
  async() => {
    const rconPlayers = await players();

    if (!rconPlayers.length) {
      return 'No players online.';
    } else {
      return handleStringArray(await players())
    }
  }
);

export { online };

