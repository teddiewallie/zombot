const blockify = (message) => `\`\`\`${message}\`\`\``;

const seconds = (sec) => (sec * 1000);
const minutes = (min) => (min * 60 * 1000);
const hours = (hr) => (hr * 60 * 60 * 1000);

const UTF8 = 'utf8';

export {
  blockify,
  seconds,
  minutes,
  hours,
  UTF8
};

