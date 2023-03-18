import config from './config.json' assert { type: 'json' };

class Command {
  constructor(name, description, action) {
    this.name = name;
    this.description = description;
    this.action = action;
  }

  getName() {
    return this.name;
  }

  async run(...args) {
    return await this.action(...args);
  }

  getDescription(spacer) {
    const { PREFIX, SMALL_MARGIN } = config;
    const parts = this.description.split(' - ');

    if (parts.length !== 2 || !spacer) {
      return `${PREFIX}${this.description}`;
    }

    return `${PREFIX}${parts[0]}${spacer(SMALL_MARGIN - parts[0].length, ' ')}${parts[1]}`;
  }
}

export { Command };

