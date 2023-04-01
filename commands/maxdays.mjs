import { Command } from '../helpers/Command.mjs';

import { get } from '../services/database.mjs';
import { nameIsKnown } from '../helpers/utils.mjs';

const maxdays = new Command('maxdays', 'maxdays Ted - Get the session where Ted survived the most days.', async (name) => {
  const isKnown = await nameIsKnown(name);

  if (!name) {
    return 'Gotta need a name on the dude, yo.';
  } else if (!isKnown) {
    return 'Don\'t know that name, dude.';
  }

  return get('SELECT MAX(hours) FROM session WHERE name=?', [name], (row, resolve) => {
    if (!row) {
      resolve(`No hour data on ${name} right now.`);
    }

    const days = row['MAX(hours)'] / 24;

    resolve(`At most, ${name} has survived ${days.toFixed(2)} days.`);
  });
});

export { maxdays };

