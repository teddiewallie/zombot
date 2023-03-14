import { logkeys } from './utils.mjs';
import { Logger } from './logger.mjs';
import sqlite3 from 'sqlite3';

const getDb = () => global.database;

const run = (query) => {
  const logger = new Logger('database:run');
  logger.info(query);

  return global.database.run(query);
}

const get = (query, data, callback) => new Promise((resolve, reject) => {
  const logger = new Logger('database:get');
  logger.info(query);

  global.database.get(query, data, (err, row) => {
    if (err) {
      logger.error(err);
      return;
    }

    callback(row, resolve, reject);
  });
});

const getAll = (query, data, callback) => new Promise((resolve, reject) => {
  const logger = new Logger('database:getAll');
  logger.info(query);

  global.database.all(query, data, (err, rows) => {
    if (err) {
      logger.error(err);
      return;
    }

    callback(rows, resolve, reject);
  });
});

const createSession = (name) => run(`INSERT INTO session (name, hours) VALUES ("${name}", 0)`);

const getSessionId = async (name) => new Promise((resolve, reject) => {
  get(`SELECT id FROM session WHERE name=? ORDER BY timestamp DESC`, [name], (row) => {
    row?.id && resolve(row.id);
    !row?.id && resolve(null);
  });
});

const handleItem = async (entities) => {
  const logger = new Logger('database:handleItem');
  const keys = logkeys.ITEM;

  const sessionId = await getSessionId(entities[keys.NAME]);
  run(`UPDATE session SET coords="${entities[keys.COORDS].replaceAll(',','x')}" WHERE id=${sessionId}`);

  logger.info(entities);
};

const handlePlayer = async (entities) => {
  const logger = new Logger('database:handlePlayer');
  const keys = logkeys.PLAYER;

  const name = entities[keys.NAME];
  const stats = entities[keys.STATS];
  const health = entities[keys.HEALTH];
  const traits = entities[keys.TRAITS];
  const perks = entities[keys.PERKS];
  const coords = entities[keys.COORDS];

  let sessionId = await getSessionId(name);

  let replaceSession = '';

  if (sessionId) {
    replaceSession += 'REPLACE INTO session(id, name, kills, health, infected, coords, hours) VALUES ';
    replaceSession += `(${sessionId}, "${name}", ${stats.kills}, ${health.health}, "${health.infected}", "${coords}", ${stats.hours})`;
    run(replaceSession);
  } else {
    replaceSession += 'INSERT INTO session(name, kills, health, infected, coords, hours) VALUES ';
    replaceSession += `("${name}", ${stats.kills}, ${health.health}, "${health.infected}", "${coords}", ${stats.hours})`;
    run(replaceSession);

    sessionId = await getSessionId(name);
  }

  traits.forEach && traits.forEach(async (trait) => {
    run(`DELETE FROM trait WHERE session_id=${sessionId} AND name="${trait}"`);
    run(`INSERT INTO trait(session_id, name) VALUES (${sessionId}, "${trait}")`);
  });


  const perkKeys = Object.keys(perks);

  perkKeys.forEach && perkKeys.forEach(async (perk) => {
    run(`DELETE FROM perk WHERE session_id=${sessionId} AND name="${perk}"`);
    run(`INSERT INTO perk(session_id, name, value) values (${sessionId}, "${perk}", ${perks[perk]})`);
  });

  logger.info(entities);
};

const handlePerkLog = async(entities) => {
  const logger = new Logger('database:handlePerkLog');
  const keys = logkeys.PERK;

  const name = entities[keys.NAME];
  const payload = entities[keys.PAYLOAD];

  const payloadType = Object.keys(payload)[0];

  if (payloadType.includes('Created')) {
    createSession(name);
  } else if (payloadType.includes('Died')) {
    logger.info('DEAD');
  }

  logger.info(entities);
};

const handleRconPlayers = (players) => {
  const logger = new Logger('database:handleRconPlayers');

  get('SELECT SUM(kills) FROM session', [], (killsRow) => {
    get('SELECT COUNT(name) FROM session', [], (countRow) => {
      get('SELECT COUNT(DISTINCT name) FROM session', [], (countDistinctRow) => {
        const OLD = 1;
        global.setActivity(`with ${players.length} 👤 (${killsRow['SUM(kills)']}/${countRow['COUNT(name)'] - countDistinctRow['COUNT(DISTINCT name)'] + OLD})`);
      });
    });
  });

  logger.info(players);
};

const initDatabase = async () => {
  const logger = new Logger('database:initDatabase');
  const { DB_ROOT } = global.config;

  global.database = new sqlite3.Database(`${DB_ROOT}/storage.sqlite3`);
  global.database.on('error', (e) => console.error(e));

  const create = (name) => `CREATE TABLE IF NOT EXISTS ${name} (`;

  let session = '';
  session += create('session');
  session += 'id INTEGER PRIMARY KEY AUTOINCREMENT, ';
  session += 'name TEXT DEFAULT "", ';
  session += 'kills INTEGER DEFAULT 0, ';
  session += 'health INTEGER DEFAULT 0, ';
  session += 'infected INTEGER DEFAULT 0, ';
  session += 'coords TEXT DEFAULT "0,0,0", ';
  session += 'hours INTEGER DEFAULT 0, ';
  session += 'timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)'
  run(session);

  let perk = '';
  perk += create('perk');
  perk += 'session_id INTEGER, ';
  perk += 'name TEXT, ';
  perk += 'value INTEGER)';
  run(perk);

  let trait = '';
  trait += create('trait');
  trait += 'session_id INTEGER, ';
  trait += 'name TEXT)';
  run(trait);

  return Promise.resolve();
};

export {
  initDatabase,
  handleItem,
  handlePlayer,
  handlePerkLog,
  handleRconPlayers,
  get,
  getAll,
  getSessionId
};
