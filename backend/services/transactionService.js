const { pool } = require('../models');

exports.createTransaction = async ({ account_id, type, amount }) => {
  const acceptedTypes = ['deposit', 'withdrawal', 'transfer'];
  if (!acceptedTypes.includes(type)) throw { status: 400, message: 'Invalid transaction type' };
  if (amount > 10000) throw { status: 400, message: 'Transaction amount exceeds limit' };

  const result = await pool.query(
    'INSERT INTO transactions (account_id, type, amount) VALUES (, , ) RETURNING *',
    [account_id, type, amount]
  );
  return result.rows[0];
};
