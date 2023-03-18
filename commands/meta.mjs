import { Command } from '../helpers/Command.mjs';
import { get, getSessionId } from '../services/database.mjs';
import { handleStringArray, nameIsKnown } from '../helpers/utils.mjs';

import { kpm } from './kpm.mjs';

const meta = new Command('meta', 'meta Ted - Check meta info about Ted.', async (name, MOBILE) => {
  const isKnown = await nameIsKnown(name);

  if (!name) {
    return 'Gotta need a name yo.';
  } else if (!isKnown) {
    return 'Don\'t know that name.';
  }

  const sessionId = await getSessionId(name);

  return get('SELECT timeonline,timestamp FROM session WHERE id=?', [sessionId], async (row, resolve) => {
    row && resolve(handleStringArray([
      name,
      `Session Started ${row.timestamp}`,
      `${await kpm.run(name)}`,
      `Session Online Time: ${Math.ceil(row.timeonline / 60)} minutes`
    ], MOBILE));
    !row && resolve('');
  });
});

export { meta };

