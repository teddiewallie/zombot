import { Command } from '../Command.mjs';
import { getAll, getSessionId } from '../database.mjs';
import { handleStringArray } from '../utils.mjs';

const users = new Command('users', 'users - Show known users.', async (MOBILE) => {
  return getAll('SELECT DISTINCT name FROM session', [], (rows, resolve) => {
    resolve(handleStringArray(rows.map((row) => row.name), MOBILE));
  });
});

export { users };
