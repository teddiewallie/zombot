import { table } from 'table';

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

const parse = (msg) => {
  const words = msg.split(' ');
  const command = words.shift();

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

    case 'help': {
      return `\`\`\`
!info Ted - full info on Ted
!stats Ted - stats parts on Ted
!health Ted - Ted's health
!perks Ted - Ted's perks
!whereis Ted - location of Ted
!whereis safehouse - location of safe house
      \`\`\``
    }
  }
};

export { parse };

