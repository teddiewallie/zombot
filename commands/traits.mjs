import { Command } from '../helpers/Command.mjs';
import { getAll, getSessionId } from '../services/database.mjs';
import { handleStringArray, pascalSpace, nameIsKnown } from '../helpers/utils.mjs';

const traits = new Command('traits', 'traits Ted - Check Ted\'s traits.', async (name, MOBILE) => {
  const isKnown = await nameIsKnown(name);

  if (!name) {
    return 'Gonna need a name on the dude, yo.';
  } else if (!isKnown) {
    return 'Don\'t know that name.';
  }

  const sessionId = await getSessionId(name);

  return getAll('SELECT name FROM trait WHERE session_id=?', [sessionId], (rows, resolve) => {
    rows && resolve(handleStringArray(rows.map((row) => pascalSpace(row.name)), MOBILE));
    !rows && resolve('Couldn\'t get the trait data right now.');
  });
});

export { traits };

