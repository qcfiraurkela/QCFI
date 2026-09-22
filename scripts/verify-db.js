const Database = require('better-sqlite3');
const db = new Database('qcfi_database.db');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables.map(t => t.name).join(', '));
const counts = {
  hero_images: db.prepare('SELECT COUNT(*) as c FROM hero_images').get().c,
  events: db.prepare('SELECT COUNT(*) as c FROM events').get().c,
  event_images: db.prepare('SELECT COUNT(*) as c FROM event_images').get().c,
  quality_concepts: db.prepare('SELECT COUNT(*) as c FROM quality_concepts').get().c,
  concept_images: db.prepare('SELECT COUNT(*) as c FROM concept_images').get().c,
  quizzes: db.prepare('SELECT COUNT(*) as c FROM quizzes').get().c,
  magazines: db.prepare('SELECT COUNT(*) as c FROM magazines').get().c,
};
console.log('Row counts:', JSON.stringify(counts, null, 2));
db.close();
