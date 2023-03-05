const variation = (pre, name, post) => `${pre} ${name} ${post}`;

const pick = (variations) => {
  const index = Math.floor(Math.random() * variations.length);
  return variations[index];
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

export { connected, died, disconnected, entering };
