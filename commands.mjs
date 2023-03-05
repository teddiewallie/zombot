import { table } from 'table';
import { players, servermsg } from './rcon.mjs';

const wat = () => {
  return 'not implemented';
};

const stats = (name) => {
  const thing = global.players[name];

  if (!thing?.stats) {
    return `No data on ${name} right now. Try in a few ticks.`;
  } else {
    let returner = '';

    Object.keys(thing.stats).forEach((key) => {
      returner += `${key}: ${thing.stats[key]}\n`;
    });

    return returner;
  }
};

const health = (name) => {
  const thing = global.players[name];

  if (!thing?.health) {
    return `No data on ${name} right now. Try in a few ticks.`;
  } else {
    let returner = '';

    Object.keys(thing.health).forEach((key) => {
      returner += `${key}: ${thing.health[key]}\n`;
    });

    return returner;
  }
};

const perks = (name) => {
  const thing = global.players[name];

  if (!thing?.perks) {
    return `No data on ${name} right now. Try in a few ticks.`;
  } else {
    let returner = '';

    Object.keys(thing.perks).forEach((key) => {
      if (thing.perks[key] > 0) {
        returner += `${key}: ${thing.perks[key]}\n`;
      }
    });

    return returner;
  }
};

const info = (name) => {
  const thing = global.players[name];

  if (!thing) {
    return `No data on ${name} right now. Try in a few ticks.`;
  } else {
    let returner = '```';

    returner += '== STATS == \n\n';
    returner += stats(name);

    returner += '\n\n == HEALTH == \n\n';
    returner += health(name);

    returner += '\n\n == PERKS == \n\n';
    returner += perks(name);

    returner += '```';

    return returner;
  }
};

const hp = (name) => {
  const player = global.players[name];
  if (player) {
    if (player.health.health >= 90) {
      return `${name} looks healthy to me.`;
    } else if (player.health.health < 90 && player.health.health >= 50) {
      return `${name} should probably take care of those wounds.`;
    } else if (player.health.health < 50 && player.health.health >= 20) {
      return `${name} is pretty beat up.`;
    } else if (player.health.health < 20 && player.health.health >= 10) {
      return `Uh, can someone help ${name}?`;
    } else if (player.health.health < 10 && player.health.health >= 1) {
      return `How ${name} is still alive is a mystery to me.`;
    } else {
      return `${name} has a serious case of deadness.`;
    }
  } else {
    return `No data on ${name} right now. Try in a few ticks.`;
  }
};

const infected = (name) => {
  const player = global.players[name];
  if (player) {
    return `${name} ${player.health.infected ? 'is' : 'is not'} infected.`;
  } else {
    return `No data on ${name} right now. Try in a few ticks.`;
  }
};

const profession = (name) => {
  const player = global.players[name];
  if (player) {
    return `${name} is a ${player.stats.profession}.`;
  } else {
    return `No data on ${name} right now. Try in a few ticks.`;
  }
};

const hours = (name) => {
  const player = global.players[name];
  if (player) {
    return `${name} has been alive for ${player.stats.hours} hours.`;
  } else {
    return `No data on ${name} right now. Try in a few ticks.`;
  }
};

const parse = async (msg, sender) => {
  const words = msg.split(' ');
  const command = words.shift();

  const pretext = `🖨️\`(${sender})[!${command}${words.length ? ' ' + words.join(' ') : ''}]\` `;

  try {
    switch (command) {
      case 'players': {
        return `${pretext}${await players()}`;
      }

      case 'info': {
        if (words.length >= 1) {
          return info(words.join(' '));
        } else {
          return `${pretext}Gotta need a name on the dude, yo.`;
        }
      }

      case 'stats': {
        if (words.length >= 1) {
          return `${pretext}${stats(words.join(' '))}`;
        } else {
          return `${pretext}Gotta need a name on the dude, yo.`;
        }
      }

      case 'health': {
        if (words.length >= 1) {
          return `${pretext}${health(words.join(' '))}`;
        } else {
          return `${pretext}Gotta need a name on the dude, yo.`;
        }
      }

      case 'perks': {
        if (words.length >= 1) {
          return `${pretext}${perks(words.join(' '))}`;
        } else {
          return `${pretext}Gotta need a name on the dude, yo.`;
        }
      }

      case 'hp': {
        if (words.length >= 1) {
          return `${pretext}${hp(words.join(' '))}`;
        } else {
          return `${pretext}Gotta need a name on the dude, yo.`;
        }
      }

      case 'infected': {
        if (words.length >= 1) {
          return `${pretext}${infected(words.join(' '))}`;
        } else {
          return `${pretext}Gotta need a name on the dude, yo.`;
        }
      }

        
      case 'profession': {
        if (words.length >= 1) {
          return `${pretext}${profession(words.join(' '))}`;
        } else {
          return `${pretext}Gotta need a name on the dude, yo.`;
        }
      }

      case 'hours': {
        if (words.length >= 1) {
          return `${pretext}${hours(words.join(' '))}`;
        } else {
          return `${pretext}Gotta need a name on the dude, yo.`;
        }
      }

      case 'kills': {
        if (words.length < 1) {
          const persistent = global.players?.persistent;
            return Number.isInteger(persistent?.totalKills) ?
              `${pretext}Total kills for all players is ${persistent.totalKills}.` :
              `${pretext}No total kills data right now.`;
        } else {
          const persistentPlayer = global.players?.persistent[words.join(' ')];
          return Number.isInteger(persistentPlayer?.totalKills) ?
            `${pretext}Total kills for ${words.join(' ')} is ${persistentPlayer.totalKills}.` :
            `${pretext}No total kills data for ${words.join(' ')}.`;
        }
      }

      case 'deaths': {
        if (words.length < 1) {
          const persistent = global.players?.persistent;
            return Number.isInteger(persistent?.totalDeaths) ?
              `${pretext}Total deaths for all players is ${persistent.totalDeaths}.` :
              `${pretext}No total deaths data right now.`;
        } else {
          const persistentPlayer = global.players?.persistent[words.join(' ')];
          return Number.isInteger(persistentPlayer?.totalDeaths) ?
            `${pretext}Total deaths for ${words.join(' ')} is ${persistentPlayer.totalDeaths}.` :
            `${pretext}No total deaths data for ${words.join(' ')}.`;
        }
      }

      

      case 'whereis': {
        if (words.length >= 1) {

          const name = words.join(' ');

          if (name === 'safehouse') {
            return `${pretext}https://map.projectzomboid.com/#${global.config.safehousecoords}x${global.config.zoom}`;
          }

          const thing = global.players[name];

          if (thing) {
            return `${pretext}https://map.projectzomboid.com/#${thing.coords}`;
          } else {
            return `${pretext}No data on ${name} right now. Try in a few ticks.`;
          }
        } else {
          return `${pretext}Gotta need a name on the dude, yo.`;
        }
      }

      case 'servermsg': case 'send': {
        if (words.length < 1) {
          return `${pretext}Can\'t just say nothing, boss. Give me a message to send.`;
        }

        const msg = await servermsg(sender, words.join(' '));
        return `${msg}`;
      }

      case 'json': {
        const string = JSON.stringify({ players: global.players });
        return `${string}`
      }

      case 'help': {
        const { prefix } = global.config;
        return `${pretext}\`\`\`
${prefix}hp Ted - check Ted's condition.
${prefix}infected Ted - check if Ted is infected.
${prefix}profession Ted - check what Ted works with.
${prefix}hours Ted - check how long Ted has been alive.
${prefix}info Ted - full info on Ted
${prefix}stats Ted - stats parts on Ted
${prefix}health Ted - Ted's health
${prefix}perks Ted - Ted's perks
${prefix}whereis Ted - location of Ted
${prefix}whereis safehouse - location of safe house
${prefix}players - players online
${prefix}send - send a message to the ingame chat\`\`\``
      }
    }
  } catch (e) {
    console.log(e);
  }
};

export { parse };

