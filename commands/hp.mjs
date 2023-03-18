import config from '../config.json' assert { type: 'json' };

import { Command } from '../helpers/Command.mjs';
import { nameIsKnown } from '../helpers/utils.mjs';

import { get, getSessionId } from '../services/database.mjs';

const { PREFIX } = config;

const hp = new Command('hp', 'hp Ted - Check Ted\'s current HP.', async (name) => {
  const isKnown = await nameIsKnown(name);

  if (!name) {
    return 'Gonna need a name on the dude, yo.';
  } else if (!isKnown) {
    return 'Don\'t know that name.';
  }

  const sessionId = await getSessionId(name);

  return get('SELECT health FROM session WHERE id=?', [sessionId], (row, resolve) => {
    resolve(`${name} is at ${row.health} hp.`);
  });
});

export { hp };

