import { Command } from '../helpers/Command.mjs';

import {
  meta,
  health,
  renderKills,
  perks,
  traits
} from './_index.mjs';

import { nameIsKnown } from '../helpers/utils.mjs';

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
