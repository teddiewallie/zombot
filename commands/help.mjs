import { Command } from '../helpers/Command.mjs';
import { blockify, spacer } from '../helpers/utils.mjs';

const help = new Command(
  'help',
  'help - Shows this message.',
  async () => blockify(Object
    .keys(global.registry)
    .map((key) => global.registry[key].getDescription(spacer))
    .join('\n'))
);

export { help };

