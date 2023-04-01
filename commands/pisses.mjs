import { Command } from '../helpers/Command.mjs';

import { get } from '../services/database.mjs';
import { nameIsKnown } from '../helpers/utils.mjs';

const pisses = new Command('pisses', 'shits Ted - get the total amount of pisses Ted has taken.', async (name, ONLY_NUMBERS) => {
  const isKnown = await nameIsKnown(name);

  if (!name) {
    return 'gotta need a name on the dude, yo.';
  } else if (!isKnown) {
    return 'don\'t know that name, dude.';
  }

  return get('SELECT COUNT(name) FROM defecate WHERE name=? AND type="urine"', [name], (row, resolve) => {
    if (!row) {
      resolve(`No piss data on ${name} right now.`);
    }

    ONLY_NUMBERS && resolve(row['COUNT(name)']);
    !ONLY_NUMBERS && resolve(`In total, ${name} has taken ${row['COUNT(name)']} piss${row['COUNT(name)'] > 1 ? 'es' : ''}.`);
  });
});

export { pisses };

