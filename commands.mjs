import { table } from 'table';
import { players, servermsg, kick, kicktimer } from './rcon.mjs';
import { blockify } from './utils.mjs';
import {
  noData,
  needName,
  emptyMessage
} from './dialogue.mjs';

const wat = () => {
  return 'not implemented';
};

const ticks = (amount) => Array.from(Array(amount).keys()).map(() => '●').join('');
const circles = (amount) => Array.from(Array(amount).keys()).map(() => '○').join('');
const spaces = (amount) => Array.from(Array(amount).keys()).map(() => ' ').join('');

/*
 * stats command
 */
const stats = (name) => {
  const thing = global.players[name];

  if (!thing?.stats) {
    return noData(name);
  } else {
    let returner = '';

    Object.keys(thing.stats).forEach((key) => {
      const letters = key.length;
      returner += `${key}${spaces(15-letters)}${thing.stats[key]}\n`;
    });

    return blockify(returner);
  }
};

/*
 * health command
 */
const health = (name) => {
  const thing = global.players[name];

  if (!thing?.health) {
    return noData(name)
  } else {
    Object.keys(thing.health).forEach((key) => {
      const letters = key.length;
      let returner = `${key}${spaces(15-letters)}`;

      if (key === 'health') {
        const health = Math.floor(thing.health[key] / 10);
        const padding = spaces(15 - letters);
        const ticksOrNothing = health ? ticks(health) : '';
        const circlesOrNothing = (10 - health) ? circles(10 - health) : '';
        returner += blockify(`${health ? ticks(health) : ''}${(10 - health) ? circles(10 - health) : ''}\n`);
      } else if (key === 'infected') {
        returner += blockify(`${thing.health[key] ? 'Yeah, sorry.' : 'Nah, you\'re fine.'}\n`);
      } else {
        returner = '';
      }
    });

    return returner;
  }
};

/*
 * perks command
 */
const perks = (name) => {
  const thing = global.players[name];

  if (!thing?.perks) {
    return noData(name)
  } else {
    let returner = '';

    Object.keys(thing.perks).forEach((key) => {
      if (thing.perks[key] > 0) {
        const letters = key.length;
        returner += `${key}${spaces(15-letters)}${ticks(thing.perks[key])}${circles(10 - thing.perks[key])}\n`;
      }
    });

    return blockify(returner);
  }
};

/*
 * info command
 */
const info = (name) => {
  const thing = global.players[name];

  if (!thing) {
    return noData(name)
  } else {
    let returner = '```';
    returner += stats(name);
    returner += '\n';
    returner += health(name);
    returner += '\n';
    returner += perks(name);
    returner += '```';

    return returner;
  }
};

/*
 * hp command
 */
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
    return noData(name)
  }
};

/*
 * infected command
 */
const infected = (name) => {
  const player = global.players[name];
  if (player) {
    return `${name} ${player.health.infected ? 'is' : 'is not'} infected.`;
  } else {
    return noData(name)
  }
};

/*
 * profession command
 */
const profession = (name) => {
  const player = global.players[name];
  if (player) {
    return `${name} is a ${player.stats.profession}.`;
  } else {
    return noData(name)
  }
};

/*
 * hours command
 */
const hours = (name) => {
  const player = global.players[name];
  if (player) {
    return `${name} has been alive for ${player.stats.hours} hours.`;
  } else {
    return noData(name)
  }
};

/*
 * parse the message
 */
const parse = async (msg, sender) => {
  const words = msg.split(' ');
  const command = words.shift();

  const pretext = `🖨️\`(${sender})[!${command}${words.length ? ' ' + words.join(' ') : ''}]\` `;

  try {
    switch (command) {
      case 'players': {
        return `${pretext}${await players()}`;
      }

      case 'info':       { return words.length >= 1 ? `${pretext}${info(words.join(' '))}`               : `${pretext}${needName}`; }
      case 'stats':      { return words.length >= 1 ? `${pretext}${stats(words.join(' '))}`              : `${pretext}${needName}`; }
      case 'health':     { return words.length >= 1 ? `${pretext}${health(words.join(' '))}`             : `${pretext}${needName}`; }
      case 'perks':      { return words.length >= 1 ? `${pretext}${perks(words.join(' '))}`              : `${pretext}${needName}`; }
      case 'hp':         { return words.length >= 1 ? `${pretext}${hp(words.join(' '))}`                 : `${pretext}${needName}`; }
      case 'infected':   { return words.length >= 1 ? `${pretext}${infected(words.join(' '))}`           : `${pretext}${needName}`; }
      case 'profession': { return words.length >= 1 ? `${pretext}${profession(words.join(' '))}`         : `${pretext}${needName}`; }
      case 'hours':      { return words.length >= 1 ? `${pretext}${hours(words.join(' '))}`              : `${pretext}${needName}`; }

      case 'json':       { return JSON.stringify({ players: global.players }); }
      case 'kick':       { return await kick(words.join(' '));                 }
      case 'kick1':      { return await kicktimer(words.join(' '), 1);         }
      case 'kick3':      { return await kicktimer(words.join(' '), 3);         }
      case 'kick5':      { return await kicktimer(words.join(' '), 5);         }
      case 'kick10':     { return await kicktimer(words.join(' '), 10);        }

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
            return `${pretext}${noData(name)}`;
          }
        } else {
          return `${pretext}${needName}`;
        }
      }

      case 'servermsg': case 'send': {
        if (words.length < 1) {
          return `${pretext}${emptyMessage}`;
        }

        const msg = await servermsg(sender, words.join(' '));
        return `${msg}`;
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
${prefix}kick Ted - kick Ted
${prefix}kick1 Ted - kick Ted in 1 minute
${prefix}kick[3|5|10] Ted - kick Ted in [3|5|10] minutes
${prefix}send - send a message to the ingame chat\`\`\``
      }
    }
  } catch (e) {
    console.log(e);
  }
};

export { parse };

