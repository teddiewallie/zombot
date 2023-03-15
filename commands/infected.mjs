import { Command } from '../Command.mjs';
import { get, getSessionId } from '../database.mjs';
import { nameIsKnown } from '../utils.mjs';

const infected = new Command('infected', 'infected Ted - Check if Ted is infected.', async (name) => {
  const isKnown = await nameIsKnown(name);

  if (!name) {
    return 'Gonna need a name on the dude, yo.';
  } else if (!isKnown) {
    return 'Don\'t know that name.';
  }

  const sessionId = await getSessionId(name);

  return get('SELECT infected FROM session WHERE id=?', [sessionId], (row, resolve) => {
    resolve(`${name} is ${row && row.infected === 'true' ? '' : 'not '}infected.`);
  });
});

export { infected };

