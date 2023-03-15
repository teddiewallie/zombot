import { push } from '../registry.mjs';

import { health } from './health.mjs';
import { hp } from './hp.mjs';
import { infected } from './infected.mjs';
import { info } from './info.mjs';
import { kills } from './kills.mjs';
import { kpm } from './kpm.mjs';
import { meta } from './meta.mjs';
import { online } from './online.mjs';
import { perks } from './perks.mjs';
import { renderKills } from './renderKills.mjs';
import { totalKills } from './totalKills.mjs';
import { traits } from './traits.mjs';
import { users } from './users.mjs';
import { whereis } from './whereis.mjs';
import { help } from './help.mjs';

const initCommands = () => {
  push(health);
  push(hp);
  push(infected);
  push(info);
  push(kills);
  push(kpm);
  push(meta);
  push(online);
  push(perks);
  push(renderKills);
  push(totalKills);
  push(traits);
  push(users);
  push(whereis);
  push(help);
};

export { initCommands };

