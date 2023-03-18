import config from '../config.json' assert { type: 'json' };

import { Command } from '../helpers/Command.mjs';
import { getAll, getSessionId } from '../services/database.mjs';
import { spacer, handlePairs, pascalSpace, nameIsKnown } from '../helpers/utils.mjs';

const perks = new Command('perks', 'perks Ted - Check Ted\'s perks.', async (name, MOBILE) => {
  const { FILLED_METER, EMPTY_METER, MAX_LEVEL } = config;
  const isKnown = await nameIsKnown(name);

  if (!name) {
    return 'Gonna need a name on the dude, yo.';
  } else if (!isKnown) {
    return 'Don\'t know that name.';
  }

  const sessionId = await getSessionId(name);

  return getAll('SELECT name,value FROM perk WHERE session_id=?', [sessionId], (rows, resolve) => {
    if (!rows) {
      resolve('Couldn\'t get the perk data right now.');
      return;
    }

    const perks = {};

    rows.filter((row) => row.value).forEach((row) => {
      row.name = pascalSpace(row.name);
      perks[row.name] = `${spacer(row.value, FILLED_METER)}${spacer(MAX_LEVEL - row.value, EMPTY_METER)}`;
    });

    resolve(handlePairs(perks, MOBILE));
  });
});

export { perks };

