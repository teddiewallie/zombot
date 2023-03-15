import { get, getAll, getSessionId } from './database.mjs';
import { Logger } from './logger.mjs';
import { players } from './rcon.mjs';

import { 
  blockify,
  codify,
  spacer,
  pascalSpace,
  capitalFirst,
  handlePairs,
  handleStringArray
} from './utils.mjs';

const kpm = async (name) => {
  if (!name) {
    return 'Gotta need a name yo.';
  }

  const sessionId = await getSessionId(name);

  return get('SELECT timeonline,kills FROM session WHERE id=?', [sessionId], (row, resolve) => {
    if (!row) {
      resolve(`No kills per minute data on ${name}`);
    }

    const kpmVal = row.kills / (row.timeonline / 60);

    resolve(`${kpmVal.toFixed(2)} kills per minute`);
  });
};

const kills = async (name, ONLY_NUMBERS) => {
  if (!name) {
    return 'Gonna need a name on the dude, yo.';
  }

  const sessionId = await getSessionId(name);

  return get('SELECT kills FROM session WHERE id=?', [sessionId], (row, resolve) => {
    if (!row) {
      resolve(`Couldn't get ${name}\'s kills.`);
      return;
    }

    !ONLY_NUMBERS && resolve(`${name} has killed ${row.kills} zombies since their last death.`);
    ONLY_NUMBERS && resolve(row.kills);
  });
};

const hp = async (name) => {
  if (!name) {
    return 'Gonna need a name on the dude, yo.';
  }

  const sessionId = await getSessionId(name);

  return get('SELECT health FROM session WHERE id=?', [sessionId], (row, resolve) => {
    resolve(`${name} is at ${row.health} hp.`);
  });
};

const infected = async (name) => {
  if (!name) {
    return 'Gonna need a name on the dude, yo.';
  }

  const sessionId = await getSessionId(name);

  return get('SELECT infected FROM session WHERE id=?', [sessionId], (row, resolve) => {
    resolve(`${name} is ${row && row.infected === 'true' ? '' : 'not '}infected.`);
  });
};

const health = async (name, MOBILE) => {
  if (!name) {
    return 'Gonna need a name on the dude, yo.';
  }

  const sessionId = await getSessionId(name);

  return get('SELECT health,infected FROM session WHERE id=?', [sessionId], (row, resolve) => {
    if (!row) {
      resolve('Couldn\'t get the health data right now.');
      return;
    }

    console.log(row.infected);

    const infected = row.infected === 'true' ? 'Yes' : 'No';

    row.infected = infected;
    resolve(handlePairs(row, MOBILE));
  });
};

const mhealth = async (name) => {
  const MOBILE = true;
  return await health(name, MOBILE);
};

const perks = async (name, MOBILE) => {
  const { FILLED_METER, EMPTY_METER, MAX_LEVEL } = global.config;
  if (!name) {
    return 'Gonna need a name on the dude, yo.';
  }

  const sessionId = await getSessionId(name);

  return getAll('SELECT name,value FROM perk WHERE session_id=?', [sessionId], (rows, resolve) => {
    if (!rows) {
      resolve('Couldn\'t get the perk data right now.');
      return;
    }

    const perks = {};

    rows.filter((row) => row.value).forEach((row) => {
      row.name = pascalSpace(row.name);
      perks[row.name] = `${spacer(row.value, FILLED_METER)}${spacer(MAX_LEVEL - row.value, EMPTY_METER)}`;
    });

    resolve(handlePairs(perks, MOBILE));
  });
};

const mperks = async (name) => {
  const MOBILE = true;
  return await perks(name, MOBILE);
};

const traits = async (name, MOBILE) => {
  if (!name) {
    return 'Gonna need a name on the dude, yo.';
  }

  const sessionId = await getSessionId(name);

  return getAll('SELECT name FROM trait WHERE session_id=?', [sessionId], (rows, resolve) => {
    rows && resolve(handleStringArray(rows.map((row) => pascalSpace(row.name)), MOBILE));
    !rows && resolve('Couldn\'t get the trait data right now.');
  });
};

const users = async (MOBILE) => {
  return getAll('SELECT DISTINCT name FROM session', [], (rows, resolve) => {
    resolve(handleStringArray(rows.map((row) => row.name), MOBILE));
  });
};

const mtraits = async (name) => {
  const MOBILE = true;
  return await traits(name, MOBILE);
};

const whereis = async (name) => {
  if (!name) {
    return 'Gonna need a name on the dude, yo.';
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
};

const totalKills = async (name, ONLY_NUMBERS) => {
  if (!name) {
    return get('SELECT SUM(kills) FROM session', [], (row, resolve) => {
      row && !ONLY_NUMBERS && resolve(`Overall kills is at ${row['SUM(kills)']}.`);
      row && ONLY_NUMBERS && resolve(row['SUM(kills)']);
    });
  }

  return get('SELECT SUM(kills) FROM session WHERE name=?', [name], (row, resolve) => {
    row && !ONLY_NUMBERS && resolve(`${name} has killed a total of ${row['SUM(kills)']} zombies.`);
    row && ONLY_NUMBERS && resolve(row['SUM(kills)']);
  });
};

const meta = async (name, MOBILE) => {
  if (!name) {
    return;
  }

  const sessionId = await getSessionId(name);

  return get('SELECT timeonline,timestamp FROM session WHERE id=?', [sessionId], async (row, resolve) => {
    row && resolve(handleStringArray([name, `Session Started ${row.timestamp}`, `${await kpm(name)}`, `Session Online Time: ${Math.ceil(row.timeonline / 60)} minutes`], MOBILE));
    !row && resolve('');
  });
};

const renderKills = async (name, MOBILE) => {
  const pairs = {};
  const ONLY_NUMBERS = true;
  pairs['Session Kills'] = await kills(name, ONLY_NUMBERS);
  pairs['Total Kills'] = await totalKills(name, ONLY_NUMBERS);
  return handlePairs(pairs, MOBILE);
}

const online = async() => handleStringArray(await players());

const info = async (name) => {
  let returner = '';
  returner += await meta(name);
  returner += await health(name);
  returner += await renderKills(name);
  returner += await perks(name);
  returner += await traits(name);
  return returner;
};

const minfo = async (name) => {
  let returner = '';
  const MOBILE = true;
  returner += await meta(name, MOBILE);
  returner += await mhealth(name);
  returner += await renderKills(name, MOBILE);
  returner += await mperks(name);
  returner += await mtraits(name);
  return returner;
};

const help = () => {
  const { MARGIN, PREFIX } = global.config;
  const count = (string) => string.length;

  const pairs = {};
  pairs[`${PREFIX}kills Ted`] = 'Get how many zombies Ted has killed since their last death.';
  pairs[`${PREFIX}health Ted`] = 'Get health info about Ted.';
  pairs[`${PREFIX}hp Ted`] = 'Get current hp on Ted.';
  pairs[`${PREFIX}infected Ted`] = 'Check if Ted is infected.';
  pairs[`${PREFIX}perks Ted`] = 'Get Ted\'s perks.';
  pairs[`${PREFIX}traits Ted`] = 'Get Ted\'s traits.';
  pairs[`${PREFIX}info Ted`] = 'Get all info about Ted.';
  pairs[`${PREFIX}totalKills Ted`] = 'Ted\'s total amount of kills over all sessions.';
  pairs[`${PREFIX}users`] = 'Show all users that have played on the server.';
  pairs[`${PREFIX}online`] = 'Show all online players.';
  pairs[`${PREFIX}whereis Ted`] = 'Show last recorded location of Ted.';
  pairs[`${PREFIX}whereis safehouse`] = 'Show where the safehouse is.';

  return blockify(Object.keys(pairs).map((key) => {
    return `${key}${spacer(MARGIN - key.length, ' ')}${pairs[key]}`;
  }).join('\n'));
};

const commands = {
  health,
  mhealth,
  hp,
  mperks,
  perks,
  mtraits,
  traits,
  users,
  info,
  minfo,
  whereis,
  help,
  online,
  totalKills,
  infected,
  kills,
  kpm
};

export { commands };

