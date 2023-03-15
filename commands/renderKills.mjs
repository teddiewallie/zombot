import { Command } from '../Command.mjs';
import { kills } from './kills.mjs';
import { totalKills } from './totalKills.mjs';
import { handlePairs, nameIsKnown } from '../utils.mjs';

const renderKills = new Command('renderKills', 'renderKills Ted - get session and total kills.', async (name, MOBILE) => {
  const isKnown = await nameIsKnown(name);

  if (!name) {
    return 'Gonna need a name yo.';
  } else if (!isKnown) {
    return 'Don\'t know that name.';
  }

  const pairs = {};
  const ONLY_NUMBERS = true;
  pairs['Session Kills'] = await kills.run(name, ONLY_NUMBERS);
  pairs['Total Kills'] = await totalKills.run(name, ONLY_NUMBERS);
  return handlePairs(pairs, MOBILE);
});

export { renderKills };

