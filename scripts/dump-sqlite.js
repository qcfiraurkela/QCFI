const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'qcfi_database.db');
const db = new Database(dbPath);

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
console.log('Tables found:', tables.map(t => t.name));

const dump = {};
for (const { name } of tables) {
  dump[name] = db.prepare(`SELECT * FROM ${name}`).all();
  console.log(`Table ${name}: ${dump[name].length} rows`);
}

fs.writeFileSync(path.join(__dirname, 'sqlite_dump.json'), JSON.stringify(dump, null, 2));
console.log('Dump saved to scripts/sqlite_dump.json');
