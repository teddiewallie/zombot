import { spacer, blockify } from './utils.mjs';

class Logger {
  constructor(name) {
    this.name = name;
  }

  info(message) {
    const { LOG_MARGIN } = global.config;
    console.log(`(i)[${this.name}]${spacer(LOG_MARGIN - this.name.length, ' ')}${message}`);
  }

  error(message) {
    const { LOG_MARGIN } = global.config;
    console.error(`(e)[${this.name}]${spacer(LOG_MARGIN - this.name.length, ' ')}${message}`);
  }
}

export { Logger };
