require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DATABASE_URL.replace('sqlite:', '');
const db = new sqlite3.Database(dbPath);

const pool = {
  query: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        db.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve({ rows });
        });
      } else {
        db.run(sql, params, function(err) {
          if (err) reject(err);
          else resolve({ rows: [{ id: this.lastID }] });
        });
      }
    });
  }
};

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      loyalty_level TEXT DEFAULT 'standard',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      account_number TEXT UNIQUE NOT NULL,
      balance REAL DEFAULT 0.00,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      priority_shipping INTEGER DEFAULT 0,
      backordered INTEGER DEFAULT 0,
      discount_applied INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account_id INTEGER REFERENCES accounts(id),
      type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'transfer')),
      amount REAL NOT NULL CHECK (amount > 0 AND amount <= 10000),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

module.exports = {
  pool,
  createTables,
};
