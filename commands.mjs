import { table } from 'table';
import { servermsg } from './rcon.mjs';

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
    return `\`\`\`No data on ${name} right now. Try in a few ticks.\`\`\``;
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

const parse = async (msg, sender) => {
  const words = msg.split(' ');
  const command = words.shift();

  try {
    switch (command) {
      case 'info': {
        if (words.length >= 1) {
          return info(words.join(' '));
        } else {
          return '```Gotta need a name on the dude, yo.```';
        }
      }

      case 'stats': {
        if (words.length >= 1) {
          return `\`\`\`${stats(words.join(' '))}\`\`\``;
        } else {
          return '```Gotta need a name on the dude, yo.```';
        }
      }

      case 'health': {
        if (words.length >= 1) {
          return `\`\`\`${health(words.join(' '))}\`\`\``;
        } else {
          return '```Gotta need a name on the dude, yo.```';
        }
      }

      case 'perks': {
        if (words.length >= 1) {
          return `\`\`\`${perks(words.join(' '))}\`\`\``;
        } else {
          return '```Gotta need a name on the dude, yo.```';
        }
      }

      case 'kills': {
        if (words.length < 1) {
          const persistent = global.players?.persistent;
            return Number.isInteger(persistent?.totalKills) ?
              `\`\`\`Total kills for all players is ${persistent.totalKills}.\`\`\`` :
              `\`\`\`No total kills data right now.\`\`\``;
        } else {
          const persistentPlayer = global.players?.persistent[words.join(' ')];
          return Number.isInteger(persistentPlayer?.totalKills) ?
            `\`\`\`Total kills for ${words.join(' ')} is ${persistentPlayer.totalKills}.\`\`\`` :
            `\`\`\` No total kills data for ${words.join(' ')}.\`\`\``;
        }
      }

      case 'deaths': {
        if (words.length < 1) {
          const persistent = global.players?.persistent;
            return Number.isInteger(persistent?.totalDeaths) ?
              `\`\`\`Total deaths for all players is ${persistent.totalDeaths}.\`\`\`` :
              `\`\`\`No total deaths data right now.\`\`\``;
        } else {
          const persistentPlayer = global.players?.persistent[words.join(' ')];
          return Number.isInteger(persistentPlayer?.totalDeaths) ?
            `\`\`\`Total deaths for ${words.join(' ')} is ${persistentPlayer.totalDeaths}.\`\`\`` :
            `\`\`\` No total deaths data for ${words.join(' ')}.\`\`\``;
        }
      }

      

      case 'whereis': {
        if (words.length >= 1) {

          const name = words.join(' ');

          if (name === 'safehouse') {
            return `https://map.projectzomboid.com/#${global.config.safehousecoords}x${global.config.zoom}`;
          }

          const thing = global.players[name];

          if (thing) {
            return `https://map.projectzomboid.com/#${thing.coords}`;
          } else {
            return `\`\`\`No data on ${name} right now. Try in a few ticks.\`\`\``;
          }
        } else {
          return '```Gotta need a name on the dude, yo.```';
        }
      }

      case 'servermsg': case 'send': {
        if (words.length < 1) {
          return '```Can\'t just say nothing, boss. Give me a message to send.```';
        }

        const msg = await servermsg(sender, words.join(' '));
        return `\`\`\`${msg}\`\`\``;
      }

      case 'json': {
        const string = JSON.stringify({ players: global.players });
        return `\`\`\`${string}\`\`\``
      }

      case 'help': {
        const { prefix } = global.config;
        return `\`\`\`${prefix}info Ted - full info on Ted
${prefix}stats Ted - stats parts on Ted
${prefix}health Ted - Ted's health
${prefix}perks Ted - Ted's perks
${prefix}whereis Ted - location of Ted
${prefix}whereis safehouse - location of safe house
${prefix}send - send a message to the ingame chat\`\`\``
      }
    }
  } catch (e) {
    console.log(e);
  }
};

export { parse };

