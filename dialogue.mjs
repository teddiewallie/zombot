import { blockify } from './utils.mjs';

const dumpMessage = (dump) => `Time for a dump ${blockify(dump)}`;
const discordLoggedIn = (tag) => `Logged in as ${tag}!`;
const commandFailed = 'Uh, something exloded back here. Try that later.';
const kicktimerMessage = (name, time) => `${name} will be kicked in ${time} minute${time > 1 ? 's' : ''}.`;
const killedZombiesAmount = (name, newKills, mapLink) => `☠ ${name} has killed ${newKills} zombies since their last death. ${maplink}`;
const levelUp = (name, perk, level, maplink) => `🎆 ${name} reached ${perk} level ${level}. ${maplink}`;
const noData = (name) => `🤷 No data on ${name} right now. Try in a few ticks.`;
const needName = 'Gotta need a name on the dude, yo.';
const emptyMessage = 'Can\'t just say nothing, boss. Give me a message to send.';

const statusMessage = (
  players, totalKills, totalDeaths
) => `with ${players} 🧍 [${totalKills}|${totalDeaths}]`;

const variation = (pre, name, post) => `${pre} ${name} ${post}`;

const pick = (variations) => {
  const index = Math.floor(Math.random() * variations.length);
  return variations[index];
}

const lowHealth = (name) => {
  const variations = [
    `👩 Jesus Christ, someone call an ambulance for ${name}!`,
    `👩 It looks like ${name} is about to be zombie food soon.`,
    `👩 What the hell happened to ${name}? His guts are practically hanging outside his body!`,
    `👩 Uh, I think ${name} needs some backup.`
  ];

  return `👩 ${pick(variations)}`;
}

const entering = (name, coords) => {
  const variations = [
    variation('', name, 'is about to open a can of whoopass.'),
    variation('It looks like', name, 'is ready for some action.'),
    variation('To the zombies\' demise', name, 'decided to play.'),
    variation('Is that', `${name}'s`, 'footsteps I hear?')
  ];

  const url = coords ? ` https://map.projectzomboid.com/#${coords}` : '';
  return `💁 ${pick(variations)}${url}`;
};

const connected = (name) => {
  const variations = [
    variation('To everyone\'s delight', name, 'has joined the server.'),
  ];

  return `🟢 ${pick(variations)}`;
};

const died = (name, coords) => {
  const variations = [
    variation('', name, 'died a horrible death.'),
    variation('', name, 'died. They will not be missed since their family is busy eating brains.'),
    variation('', name, 'is dead. Rest in peace.'),
    variation('The inevitable has happened.', name, 'has died.'),
    variation('Oh, that looked nasty.', name, 'will not come back from that one.')
  ];

  // const stats = global.players[name] ?
  //   ` They survived for ${global.players[name].stats.hours} hours and killed approximately ${global.players[name].stats.kills} zombies.` :
  //   '';

  const url = coords ? ` https://map.projectzomboid.com/#${coords}` : '';
  
  return `🪦${pick(variations)}${url}`;
};

const disconnected = (name) => {
  const variations = [
    variation('', name, 'ragequitted.'),
    variation('It seems that', name, 'has had enough of zombies for now.'),
    variation('', name, 'went IRL.'),
    variation('', name, 'has had enough zombie blood on their shirt for now.')
  ];

  return `🔴 ${pick(variations)}`;
};

export {
  statusMessage,
  dumpMessage,
  connected,
  died,
  disconnected,
  entering,
  discordLoggedIn,
  lowHealth,
  levelUp,
  noData,
  needName,
  emptyMessage,
  commandFailed
};

