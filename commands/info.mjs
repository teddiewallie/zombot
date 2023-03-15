import { Command } from '../Command.mjs';

import { meta } from './meta.mjs';
import { health } from './health.mjs';
import { renderKills } from './renderKills.mjs';
import { perks } from './perks.mjs';
import { traits } from './traits.mjs';

import { nameIsKnown } from '../utils.mjs';

const info = new Command('info', 'info Ted - See compiled info about Ted.', async (name) => {
  const isKnown = await nameIsKnown(name);

  if (!isKnown) {
    return 'Don\'t know that name.';
  }

  let returner = '';
  returner += await meta.run(name);
  returner += await health.run(name);
  returner += await renderKills.run(name);
  returner += await perks.run(name);
  returner += await traits.run(name);
  return returner;
});

export { info };
