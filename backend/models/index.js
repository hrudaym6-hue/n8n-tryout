const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const createTables = async () => {
  await pool.query();
  await pool.query();
  await pool.query();
  await pool.query();
};

module.exports = {
  pool,
  createTables,
};
