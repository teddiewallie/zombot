const variation = (pre, name, post) => `${pre} ${name} ${post}`;
const pick = (variations) => (variations[Math.floor(Math.random() * variations.length - 1)]);

const connected = (name) => {
  const variations = [
    variation('', name, 'is about to open a can of whoopass.'),
    variation('To everyone\'s delight', name, 'has joined the server.'),
    variation('It looks like', name, 'is ready for some action.'),
    variation('Is that', `${name}'s`, 'footsteps i hear entering the server?'),
    variation('To the zombies\' demise', name, 'just arrived.')
  ];

  return `🟢 ${pick(variations)}`;
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

export { connected, disconnected };
