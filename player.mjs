const tick = (line) => {
  const entities = line.split(' ');
  const statsRaw = entities.find((entity) => entity.includes('stats'))?.split('stats=')[1];
  const perksRaw = entities.find((entity) => entity.includes('perks'))?.split('perks=')[1];
  const healthRaw = entities.find((entity) => entity.includes('health'))?.split('health=')[1];

  const name = entities[3].replace(/^"(.*)"$/, '$1');

  const stats = statsRaw && JSON.parse(statsRaw);
  const perks = statsRaw && JSON.parse(perksRaw);
  const health = healthRaw && JSON.parse(healthRaw);

  if (global.players[name]) {
    const bumps = {};
    const oldPerks = global.players[name].perks;

    Object.keys(perks).forEach((perk) => {
      if (!bumps.perks) {
        bumps.perks = {};
      }

      if (oldPerks[perk] !== perks[perk]) {
        bumps.perks[perk] = perks[perk];
      }
    });

    const oldKills = global.players[name].stats.kills;
    const newKills = stats.kills;

    let messages = [];

    if (oldKills !== newKills) {
      messages.push(`${name} has killed ${newKills} zombies since their last death.`);
    }


    const bumpKeys = Object.keys(bumps.perks);
    if (bumpKeys.length > 0) {
      bumpMessages = bumpKeys.map((bumpKey) => `${name} reached ${bumpKey} level ${bumps[bumpKey]}.`);
      messages = [...messages, ...bumpMessages];
    }

    global.players[name] = { stats, perks, health };

    return messages;
  }

  global.players[name] = { stats, perks, health };

  return [];
};

export { tick };
