import { Command } from '../helpers/Command.mjs';

import { shits, pisses } from './_index.mjs';
import { handlePairs } from '../helpers/utils.mjs';

const defecate = new Command('defecate', 'defecate Ted - Show defecate info about Ted.', async (name) => {
  const ONLY_NUMBERS = true;

  const nameShits = await shits.run(name, ONLY_NUMBERS);
  const namePisses = await pisses.run(name, ONLY_NUMBERS);

  return handlePairs([{ 'Shits': nameShits, 'Pisses': namePisses }]);
});

export { defecate };

