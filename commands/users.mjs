import { Command } from '../helpers/Command.mjs';
import { getAll, getSessionId } from '../services/database.mjs';
import { handleStringArray } from '../helpers/utils.mjs';

const users = new Command('users', 'users - Show known users.', async (MOBILE) => {
  return getAll('SELECT DISTINCT name FROM session', [], (rows, resolve) => {
    resolve(handleStringArray(rows.map((row) => row.name), MOBILE));
  });
});

export { users };
