import { Command } from '../Command.mjs';
import { blockify, spacer } from '../utils.mjs';

const help = new Command(
  'help',
  'help - Shows this message.',
  async () => blockify(Object
    .keys(global.registry)
    .map((key) => global.registry[key].getDescription(spacer))
    .join('\n'))
);

export { help };

