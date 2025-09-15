const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      loyalty_level VARCHAR(20) DEFAULT 'BRONZE',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS accounts (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(50) REFERENCES users(user_id),
      account_number VARCHAR(20) UNIQUE NOT NULL,
      balance DECIMAL(15,2) DEFAULT 0.00,
      account_type VARCHAR(20) DEFAULT 'CHECKING',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      account_number VARCHAR(20) REFERENCES accounts(account_number),
      transaction_type VARCHAR(20) NOT NULL,
      amount DECIMAL(15,2) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(50) REFERENCES users(user_id),
      order_type VARCHAR(50) NOT NULL,
      status VARCHAR(20) DEFAULT 'PENDING',
      details JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

module.exports = {
  pool,
  createTables,
};
