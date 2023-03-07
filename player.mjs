const { lowHealth } = './dialogue.mjs';

/*
 * Get info from the log line word array.
 */
const getInfo = (entities) => {
  const statsRaw = entities.find((entity) => entity.includes('stats'))?.split('stats=')[1];
  const perksRaw = entities.find((entity) => entity.includes('perks'))?.split('perks=')[1];
  const healthRaw = entities.find((entity) => entity.includes('health'))?.split('health=')[1];

  const stats = statsRaw && JSON.parse(statsRaw);
  const perks = perksRaw && JSON.parse(perksRaw);
  const health = healthRaw && JSON.parse(healthRaw);

  return { stats, perks, health };
};

/*
 * Get map coordinates from the log line word array.
 */
const getCoords = (entities) => {
  const coordsRaw = entities[entities.length - 1].replace('(', '').replace(').', '').split(',');
  const coords = `${coordsRaw[0]}x${coordsRaw[1]}x${config.zoom}`;
};

/*
 * Get the name from the log line word array.
 */
const getName = (entities) => entities[3].replace(/^"(.*)"$/, '$1');

/*
 * Generate a map link from the coordinates.
 */
const getMaplink = (coords) => `https://map.projectzomboid.com/#${coords}`;

/*
 * Iterate through the perks.
 */
const handlePerks = (perks, player, maplink) => {
  const oldPerks = player.perks;
  const bumps = {};

  Object.keys(perks).forEach((perk) => {
    const oldPerk = oldPerks[perk] || 0;
    const newPerk = perks[perk] || 0;

    if (oldPerk < newPerk) {
      bumps[perk] = perks[perk];
    }
  });

  let messages = [];

  const bumpKeys = Object.keys(bumps) || [];
  if (bumpKeys.length > 0 && !player.dead && player.health.health) {
    messages = bumpKeys.map((bumpKey) => levelUp(name, bumpKey, bumps[bumpKey], maplink));
  }
  
  return messages;
}

/*
 * Get all the kill data.
 */
const getKills = (stats, persistent) => {
  const kills = {};

  kills.OLD = players[name].stats.kills,
  kills.NEW = stats.kills,
  kills.TOTAL = persistent.totalKills || 0
  kills.DELTA = kills.NEW - kills.OLD;

  return kills;
};

/*
 * Safely get the persistent parts for a player.
 */
const getPersistPlayer = (name, persistent) => {
  if (!persistent[name]) {
    persistent[name] = {};
  }

  return persistent[name];
};

/*
 * Log tick function.
 */
const tick = (line) => {
  try {
    const { config, players } = global;
    const { persistent } = players;

    const entities = line.split(' ');

    const { stats, perks, health } = getInfo(entities);

    const name = getName(entities);
    const coords = getCoords(entities);
    const maplink = getMaplink(coords);
    const player = players[name];
    const persistPlayer = getPersistPlayer(name, persistent);

    const kills = getKills(stats, persistent);
    const newTotalKills = kills.TOTAL + kills.DELTA;

    if (player) {
      const messages = [];

      if (kills.OLD < kills.NEW) {
        !player.dead && messages.push(killedZombiesAmount(name, kills.NEW, mapLink));
        persistent.totalKills = newTotalKills;
        persistPlayer.totalKills = newTotalKills;
      }

      if (!player.dead) {
        health.health && messages.push([...handlePerks(perks)]);
        health.health < 10 && messages.push(lowHealth(name));
        player = health.health ? player : { stats, perks, health, coords };
      } else {
        player.dead = Boolean(health.health);
      }

      return messages;
    }

    player = { stats, perks, health, coords };
    persistent[name] = { totalKills: newKills };
    persistent.totalKills = totalKills + newKills;

    return [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export { tick };

