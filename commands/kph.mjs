import { Command } from '../helpers/Command.mjs';
import { get, getSessionId } from '../services/database.mjs';
import { nameIsKnown } from '../helpers/utils.mjs';

const kph = new Command('kph', 'kph Ted - Shows Ted\'s kills per hour.', async (name) => {
  const isKnown = await nameIsKnown(name);

  if (!name) {
    return 'Gotta need a name yo.';
  } else if (!isKnown) {
    return 'Don\'t know that name.';
  }

  return get('SELECT SUM(timeonline),SUM(kills) FROM session WHERE name=?', [name], (row, resolve) => {
    if (!row) {
      resolve(`No kills per hour data on ${name}`);
    }

    const kpmVal = row['SUM(kills)'] / (row['SUM(timeonline)'] / 60 / 60);

    resolve(`${kpmVal.toFixed(2)} kills per hour`);
  });
});

export { kph };

