import { Command } from '../Command.mjs';
import { get, getSessionId } from '../database.mjs';
import { handlePairs, nameIsKnown } from '../utils.mjs';

const health = new Command('health', 'health Ted - Check health stats about Ted.', async (name, MOBILE) => {
  const isKnown = await nameIsKnown(name);

  if (!name) {
    return 'Gonna need a name on the dude, yo.';
  } else if (!isKnown) {
    return 'Don\'t know that name.';
  }

  const sessionId = await getSessionId(name);

  return get('SELECT health,infected FROM session WHERE id=?', [sessionId], (row, resolve) => {
    if (!row) {
      resolve('Couldn\'t get the health data right now.');
      return;
    }

    console.log(row.infected);

    const infected = row.infected === 'true' ? 'Yes' : 'No';

    row.infected = infected;
    resolve(handlePairs(row, MOBILE));
  });
});

export { health };

