import config from '../config.json' assert { type: 'json' };

import { spacer, blockify } from './utils.mjs';

class Logger {
  constructor(name) {
    this.name = name;
  }

  info(message) {
    const { LOG_MARGIN } = config;
    console.log(`(i)[${this.name}]${spacer(LOG_MARGIN - this.name.length, ' ')}${message}`);
  }

  error(message) {
    const { LOG_MARGIN } = config;
    console.error(`(e)[${this.name}]${spacer(LOG_MARGIN - this.name.length, ' ')}${message}`);
    console.error(message);
  }
}

export { Logger };
