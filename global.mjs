import config from './config.json' assert { type: 'json' };
import storage from './storage.json' assert { type: 'json' };

const globalinit = () => {
  global.config = config;
  global.players = storage?.players || {};
  global.players.persistent = storage?.players?.persistent || {};
};

export { globalinit };

