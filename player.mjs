const tick = (line) => {
  try {
    const entities = line.split(' ');
    const statsRaw = entities.find((entity) => entity.includes('stats'))?.split('stats=')[1];
    const perksRaw = entities.find((entity) => entity.includes('perks'))?.split('perks=')[1];
    const healthRaw = entities.find((entity) => entity.includes('health'))?.split('health=')[1];

    const name = entities[3].replace(/^"(.*)"$/, '$1');
    const coordsRaw = entities[entities.length - 1].replace('(', '').replace(').', '').split(',');
    const coords = `${coordsRaw[0]}x${coordsRaw[1]}x${global.config.zoom}`;
    const maplink = `https://map.projectzomboid.com/#${coords}`;

    const stats = statsRaw && JSON.parse(statsRaw);
    const perks = statsRaw && JSON.parse(perksRaw);
    const health = healthRaw && JSON.parse(healthRaw);

    const newKills = stats.kills;
    const totalKills = global.players.persistent.totalKills || 0;

    if (global.players[name]) {
      const bumps = {};

      if (!global.players[name].dead && health.health) {
        const oldPerks = global.players[name].perks;

        Object.keys(perks).forEach((perk) => {
          if (!bumps.perks) {
            bumps.perks = {};
          }

          const oldPerk = oldPerks[perk] || 0;
          const newPerk = perks[perk] || 0;

          if (oldPerk < newPerk) {
            bumps.perks[perk] = perks[perk];
          }
        });
      }

      let messages = [];

      if (health.health < 10) {
        try {
          const variations = [
            `👩 Jesus Christ, someone call an ambulance for ${name}!`,
            `👩 It looks like ${name} is about to be zombie food soon.`,
            `👩 What the hell happened to ${name}? His guts are practically hanging outside his body!`,
            `👩 Uh, I think ${name} needs some backup.`
          ];
          messages.push(variations[Math.random() * variations.length]);
        } catch (e) {
          console.error(e);
        }
      }


      const oldKills = global.players[name].stats.kills;

      if (oldKills < newKills) {
        if (!global.players[name].dead) {
          messages.push(`☠ ${name} has killed ${newKills} zombies since their last death. ${maplink}`);
        }

        const deltaKills = newKills - oldKills;
        global.players.persistent.totalKills = totalKills + deltaKills;

        if (!global.players.persistent[name]) {
          global.players.persistent[name] = {};
        }

        const playerTotalKills = global.players.persistent[name].totalKills || 0;
        global.players.persistent[name].totalKills = playerTotalKills + deltaKills;
      }



      const bumpKeys = bumps.perks ? Object.keys(bumps.perks) : [];
      if (bumpKeys.length > 0 && !global.players[name].dead && global.players[name].ealth.health) {
        const bumpMessages = bumpKeys.map((bumpKey) => `🎆 ${name} reached ${bumpKey} level ${bumps.perks[bumpKey]}. ${maplink}`);
        messages = [...messages, ...bumpMessages];
      }

      if (health.health !== 0 && global.players[name].dead) {
        global.players[name].dead = false;
      } else {
        global.players[name] = { stats, perks, health, coords };
      }

      return messages;
    }

    global.players[name] = { stats, perks, health, coords };
    global.players.persistent[name] = { totalKills: newKills };
    global.players.persistent.totalKills = totalKills + newKills;

    return [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export { tick };
