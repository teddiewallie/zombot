import config from '../config.json' assert { type: 'json' };

import { spacer, blockify, getChannel } from './utils.mjs';

class Logger {
  constructor(name) {
    this.name = name;
  }

  async info(message, SEND_TO_DISCORD) {
    const { LOG_MARGIN } = config;
    console.log(`(i)[${this.name}]${spacer(LOG_MARGIN - this.name.length, ' ')}${message}`);

    if (SEND_TO_DISCORD && message) {
      const { LOG_CHANNEL_ID } = config;
      const channel = await getChannel(LOG_CHANNEL_ID);
      channel?.send(message);
    }
  }

  error(message) {
    const { LOG_MARGIN } = config;
    console.error(`(e)[${this.name}]${spacer(LOG_MARGIN - this.name.length, ' ')}${message}`);
    console.error(message);
  }
}

export { Logger };
