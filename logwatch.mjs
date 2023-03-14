import { Tail } from 'tail';
import { glob } from 'glob';
import { players } from './rcon.mjs';

import { Logger } from './logger.mjs';

import {
  cleanString,
  logkeys,
  jsonify
} from './utils.mjs';
import {
  handleItem,
  handlePlayer,
  handlePerkLog,
  handleRconPlayers
} from './database.mjs';


// const parseDebugLog = (line) => {};
// const parseChat = (line) => {};

// [09-03-23 22:36:40.832] 76561198042014603 "sn1ckers" disconnected player (10917,10136,1).
const parseUser = (line) => {
  const logger = new Logger('logwatch:parseUser');
  logger.info(line);
};

// [09-03-23 22:34:15.384] 76561198042014603 "sn1ckers" LogExtender.write @ 10917,10133,0.
const parseCmd = (line) => {
  const logger = new Logger('logwatch:parseCmd');
  logger.info(line);
};

// [09-03-23 21:10:35.829] [76561198042014603][sn1ckers][10877,10041,0][Level Changed][Sprinting][1][Hours Survived: 125].
const parsePerkLog = (line) => {
  const logger = new Logger('logwatch:parsePerkLog');

  line = line.replaceAll('] ', ']');
  const entities = line.split('][');
  const keys = logkeys.PERK;

  entities[keys.DATETIME] = entities[keys.DATETIME].replace('[', '');
  entities[keys.HOURS] = entities[keys.HOURS].replace('].', '').replace('Hours Survived: ', '');
  entities[keys.PAYLOAD] = entities[keys.PAYLOAD] === 'died' ? 'died=1' : entities[keys.PAYLOAD];

  let obj = {};
  entities[keys.PAYLOAD].split(', ').forEach((payload) => {
    const parts = payload.split('=');
    obj[parts[0]] = parts[1];
  });

  entities[keys.PAYLOAD] = obj;
  handlePerkLog(entities);
};

const isolate = (line, before, after) => line.split(before)[1].split(after)[0];

// [09-03-23 22:34:15.384] 76561198042014603 "sn1ckers" tick
// perks={...,"Woodwork":5}
// traits=[...,"Out of Shape"]
// stats={"profession":"carpenter","kills":18,"hours":159.08}
// health={"health":100,"infected":false}
// safehouse owner=() safehouse member=() (10917,10133,0).
const parsePlayer = (line) => {
  const logger = new Logger('logwatch:parsePlayer');

  const keys = logkeys.PLAYER;
  const { ZOOM } = global.config;

  const entities = [];

  entities.push(cleanString(line.split('"')[1]));                                            // NAME
  entities.push(isolate(line, '" ', ' perks'));                                              // TYPE
  entities.push(JSON.parse(isolate(line, 'perks=', ' ')));                                   // PERKS
  entities.push(isolate(line, 'traits=', ']').split(',').map((trait) => cleanString(trait))); // TRAITS
  entities.push(JSON.parse(isolate(line, 'stats=', ' ')))                                    // STATS
  entities.push(JSON.parse(isolate(line, 'health=', ' ')))                                   // HEALTH
  entities.push(line.split(' ')[line.split(' ').length - 1].replace('(', '').replace(').', '').replaceAll(',', 'x').replace('x0', 'x16000')) // COORDS

  handlePlayer(entities);
};

// [09-03-23 22:36:40.830][INFO] user "sn1ckers" store safety enabled=true last=true cooldown=0.0 toggle=0.0.
const parsePvp = (line) => {
  const logger = new Logger('logwatch:parsePvp');
  logger.info(line);
};

// [09-03-23 22:01:29.070] [76561198042014603][ISExitVehicle][sn1ckers][10968,9761,0][SmallCar02].
const parseClientActionLog = (line) => {
  const logger = new Logger('logwatch:parseClientActionLog');
  logger.info(line);
};

// [09-03-23 22:01:29.070] 76561198042014603 "sn1ckers" exit vehicle={"id":1181,"type":"SmallCar02","center":"10967,9762,0"} at 10968,9761,0.
const parseVehicle = (line) => {
  const logger = new Logger('logwatch:parseVehicle');
  logger.info(line);
};

// [09-03-23 22:35:12.769] 76561198042014603 "sn1ckers" container +0 10920,10134,0 [Base.BookMetalWelding1].
const parseItem = (line) => {
  const logger = new Logger('logwatch:parseItem');

  const entities = line.split(' ').map((entity) => cleanString(entity));
  const keys = logkeys.ITEM;
  const { ZOOM } = global.config;

  entities[keys.ITEMNAME] = entities[keys.ITEMNAME]?.replaceAll('.', '');
  entities[keys.TIME] = entities[keys.TIME].split('.')[0];
  entities[keys.COORDS] = `${entities[keys.COORDS].slice(0,-1)}${ZOOM}`;

  handleItem(entities);
};

// [09-03-23 21:46:04.224] 76561198042014603 "sn1ckers" crafted 1 Base.RippedSheets with recipe "Rip Clothing" (10849,9971,0).
const parseCraft = (line) => {
  const logger = new Logger('logwatch:parseCraft');
  logger.info(line);
};

// [09-03-23 20:51:05.593] 76561198042014603 "sn1ckers" removed IsoObject (furniture_tables_high_01_41) at 10874,10112,0.
const parseMap = (line) => {
  const logger = new Logger('logwatch:parseMap');
  logger.info(line);
};

/*
 * create a Tail instance.
 */
const tail = async (name, callback) => {
  const logger = new Logger('logwatch:tail');
  const filename = `*${name}.txt`;
  const { LOG_ROOT, FILEWAIT_MS } = global.config;

  try {
    const truePath = await glob(`${LOG_ROOT}/${filename}`);
    if (typeof truePath[0] === 'string') {
      logger.info(`tailing ${filename}`);
      new Tail(truePath[0]).on('line', (line) => {
          callback(line);
      });
    } else {
      logger.error(`Couldn't open ${LOG_ROOT}/${filename}. Retrying in ${FILEWAIT_MS / 1000} seconds.`);
      setTimeout(() => tail(name, callback), FILEWAIT_MS);
    }
  } catch (e) {
    logger.error(e);
  }
};

const rconPlayers = () => {
  const { RCON_PLAYERS_MS } = global.config;

  setInterval(async () => {
    handleRconPlayers(await players());
  }, RCON_PLAYERS_MS);
};

/*
 * Tail the logs
 */
const initLogwatch = async () => {
  const { logs } = global.config;

  logs.USER     && tail('user',             (line) => parseUser(line)); 
  logs.CMD      && tail('cmd',              (line) => parseCmd(line));
  logs.PERK     && tail('PerkLog',          (line) => parsePerkLog(line));
  logs.PLAYER   && tail('player',           (line) => parsePlayer(line));
  logs.ACTION   && tail('ClientActionLog',  (line) => parseClientActionLog(line));
  logs.VECHICLE && tail('vehicle',          (line) => parseVehicle(line));
  logs.ITEM     && tail('item',             (line) => parseItem(line));
  logs.CRAFT    && tail('craft',            (line) => parseCraft(line));
  logs.MAP      && tail('map',              (line) => parseMap(line));

  rconPlayers();
  
  return Promise.resolve();
};

export { initLogwatch };
