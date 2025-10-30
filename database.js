const Database = require('better-sqlite3');
const db = new Database('birthdays.db');

// Veritabanı tablosunu oluştur
db.exec(`
  CREATE TABLE IF NOT EXISTS birthdays (
    user_id TEXT PRIMARY KEY,
    birth_date TEXT NOT NULL,
    timezone TEXT NOT NULL,
    guild_id TEXT NOT NULL
  )
`);

module.exports = db;