const { pool } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = async ({ user_id, password, loyalty_level }) => {
  const hashed = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (user_id, password, loyalty_level) VALUES ($1, $2, $3) RETURNING *',
    [user_id, hashed, loyalty_level]
  );
  return result.rows[0];
};

exports.login = async ({ user_id, password }) => {
  const result = await pool.query('SELECT * FROM users WHERE user_id=$1', [user_id]);
  if (!result.rows[0]) throw { status: 401, message: 'Invalid credentials' };
  const valid = await bcrypt.compare(password, result.rows[0].password);
  if (!valid) throw { status: 401, message: 'Invalid credentials' };
  return jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET || 'secret');
};
