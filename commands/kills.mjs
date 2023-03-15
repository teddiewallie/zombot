import { Command } from '../Command.mjs';
import { get, getSessionId } from '../database.mjs';
import { nameIsKnown } from '../utils.mjs';

const kills = new Command('kills', 'kills Ted - Find out how many zomboids Ted has killed.', async (name, ONLY_NUMBERS) => {
  const isKnown = await nameIsKnown(name);

  if (!name) {
    return 'Gonna need a name on the dude, yo.';
  } else if (!isKnown) {
    return 'Don\'t know that name.';
  }

  const sessionId = await getSessionId(name);

  return get('SELECT kills FROM session WHERE id=?', [sessionId], (row, resolve) => {
    if (!row) {
      resolve(`Couldn't get ${name}\'s kills.`);
      return;
    }

    !ONLY_NUMBERS && resolve(`${name} has killed ${row.kills} zombies since their last death.`);
    ONLY_NUMBERS && resolve(row.kills);
  });
});

export { kills };

