import { Command } from '../Command.mjs';
import { get, getSessionId } from '../database.mjs';
import { nameIsKnown } from '../utils.mjs';

const totalKills = new Command('totalKills', 'totalKills Ted - Check Ted\'s total kills. Omitted username shows overall kills.', async (name, ONLY_NUMBERS) => {
  const isKnown = await nameIsKnown(name);

  if (!name) {
    return get('SELECT SUM(kills) FROM session', [], (row, resolve) => {
      row && !ONLY_NUMBERS && resolve(`Overall kills is at ${row['SUM(kills)']}.`);
      row && ONLY_NUMBERS && resolve(row['SUM(kills)']);
    });
  } else if (!isKnown) {
    return 'Don\'t know that name.';
  }

  return get('SELECT SUM(kills) FROM session WHERE name=?', [name], (row, resolve) => {
    row && !ONLY_NUMBERS && resolve(`${name} has killed a total of ${row['SUM(kills)']} zombies.`);
    row && ONLY_NUMBERS && resolve(row['SUM(kills)']);
  });
});

export { totalKills };

