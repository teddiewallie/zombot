import { push } from '../helpers/registry.mjs';

import { maxdays } from './maxdays.mjs';
import { pisses } from './pisses.mjs';
import { shits } from './shits.mjs';
import { health } from './health.mjs';
import { hp } from './hp.mjs';
import { infected } from './infected.mjs';
import { info } from './info.mjs';
import { kills } from './kills.mjs';
import { kph } from './kph.mjs';
import { meta } from './meta.mjs';
import { online } from './online.mjs';
import { perks } from './perks.mjs';
import { renderKills } from './renderKills.mjs';
import { totalKills } from './totalKills.mjs';
import { traits } from './traits.mjs';
import { users } from './users.mjs';
import { whereis } from './whereis.mjs';
import { defecate } from './defecate.mjs';
import { update } from './update.mjs';
import { help } from './help.mjs';

const initCommands = () => {
  push(health);
  push(hp);
  push(infected);
  push(info);
  push(kills);
  push(kph);
  push(meta);
  push(online);
  push(perks);
  push(renderKills);
  push(totalKills);
  push(traits);
  push(users);
  push(whereis);
  push(help);
  push(maxdays);
  push(shits);
  push(pisses);
  push(defecate);
  push(update);
};

export {
  maxdays,
  pisses,
  shits,
  health,
  hp,
  infected,
  info,
  kills,
  kph,
  meta,
  online,
  perks,
  renderKills,
  totalKills,
  traits,
  users,
  whereis,
  help,
  initCommands,
  defecate
};

