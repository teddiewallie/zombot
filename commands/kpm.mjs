import { Command } from '../Command.mjs';
import { get, getSessionId } from '../database.mjs';
import { nameIsKnown } from '../utils.mjs';

const kpm = new Command('kpm', 'kpm Ted - Shows Ted\'s kills per minute.', async (name) => {
  const isKnown = await nameIsKnown(name);

  if (!name) {
    return 'Gotta need a name yo.';
  } else if (!isKnown) {
    return 'Don\'t know that name.';
  }

  const sessionId = await getSessionId(name);

  return get('SELECT timeonline,kills FROM session WHERE id=?', [sessionId], (row, resolve) => {
    if (!row) {
      resolve(`No kills per minute data on ${name}`);
    }

    const kpmVal = row.kills / (row.timeonline / 60);

    resolve(`${kpmVal.toFixed(2)} kills per minute`);
  });
});

export { kpm };

