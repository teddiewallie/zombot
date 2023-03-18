import { Command } from './Command.mjs';

global.registry = {};

const push = (command) => (global.registry[command.name] = command);
const find = (name) => {
  const fail = new Command(name, '', () => 'No such command');
  return registry[name] ? registry[name] : fail;
};

export { push, find };

