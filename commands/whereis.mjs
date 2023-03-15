import { Command } from '../Command.mjs';
import { get, getSessionId } from '../database.mjs';
import { nameIsKnown } from '../utils.mjs';

const whereis = new Command('whereis', 'whereis Ted - Find Ted\'s current location.', async (name) => {
  const isKnown = await nameIsKnown(name);

  if (!name) {
    return 'Gonna need a name on the dude, yo.';
  } else if (!isKnown) {
    return 'Don\'t know that name.';
  }

  const returner = (coords) => `${name} is here: https://map.projectzomboid.com/#${coords}`

  if (name === 'safehouse') {
    return returner('12025x2591x16000');
  }

  const sessionId = await getSessionId(name);

  return get('SELECT coords FROM session WHERE id=?', [sessionId], (row, resolve) => {
    row && resolve(returner(row.coords.replaceAll(',', 'x')));
    !row && resolve('Couldn\'t get the coords right now.');
  });
});

export { whereis };
