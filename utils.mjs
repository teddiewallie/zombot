import { Logger } from './logger.mjs';

const spacer = (amount, string) => Array.from(Array(amount).keys()).map(() => string).join('');
const blockify = (message) => `\`\`\`${message}\`\`\``;
const codify = (message) => `\`${message}\``;
const cleanString = (string) => string.replaceAll('[', '').replaceAll(']', '').replaceAll('"', '');

const logkeys = {
  ITEM: { DATE: 0, TIME: 1, ID: 2, NAME: 3, PLACE: 4, AMOUNT: 5, COORDS: 6, ITEMNAME: 7 },
  PLAYER: { NAME: 0, TYPE: 1, PERKS: 2, TRAITS: 3, STATS: 4, HEALTH: 5, COORDS: 6 },
  PERK: { DATETIME: 0, ID: 1, NAME: 2, COORDS: 3, PAYLOAD: 4, HOURS: 5 }
};

const jsonify = (thing, name) => {
  const logger = new Logger('utils:jsonify');
  const obj = {};

  thing.replace('{', '').replace('}', '').replace(`${name}=`, '').split(',').forEach((entity) => {
    const parts = entity.split(':');
    obj[parts[0]] = parts[1];
  });

  return obj;
};

const pascalSpace = (string) => string.replace(/([A-Z])/g, ' $1').trim();
const capitalFirst = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const handlePairs = (pairs) => {
  const { MARGIN, SMALL_MARGIN } = global.config;
  let returner = '';

  Object.keys(pairs).forEach((key, index) => {
    const valueLength = typeof pairs[key] === 'number' ? pairs[key].toString().length : pairs[key].length;
    if (index % 2 === 0) {
      returner += `${capitalFirst(key)}${spacer(MARGIN - key.length, ' ')}${pairs[key]}${spacer(SMALL_MARGIN - valueLength, ' ')}`;
    } else {
      returner += `${capitalFirst(key)}${spacer(MARGIN - key.length, ' ')}${pairs[key]}\n`;
    }
  });

  return blockify(returner);
};

const handleStringArray = (array) => {
  const { MARGIN, SMALL_MARGIN } = global.config;
  let returner = '';

  array.forEach((string, index) => {
    if (index % 2 === 0) {
      returner += `${string}${spacer(SMALL_MARGIN + MARGIN - string.length, ' ')}`;
    } else {
      returner += `${string}\n`;
    }
  });

  return blockify(returner);
};

export {
  cleanString,
  spacer,
  logkeys,
  jsonify,
  blockify,
  codify,
  pascalSpace,
  capitalFirst,
  handlePairs,
  handleStringArray
};
