const { pool } = require('../models');

exports.createAccount = async ({ user_id, account_number }) => {
  const result = await pool.query(
    'INSERT INTO accounts (user_id, account_number) VALUES ($1, $2) RETURNING *',
    [user_id, account_number]
  );
  return result.rows[0];
};
