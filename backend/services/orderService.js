const { pool } = require('../models');
exports.createOrder = async ({ user_id, amount, backordered }) => {
  let priority_shipping = false;
  let discount_applied = false;
  const user = await pool.query('SELECT loyalty_level FROM users WHERE id=', [user_id]);
  if (user.rows[0] && user.rows[0].loyalty_level === 'gold') discount_applied = true;
  if (!backordered && amount > 100) priority_shipping = true;
  const result = await pool.query('INSERT INTO orders (user_id, amount, status, priority_shipping, backordered, discount_applied) VALUES (, , , , , ) RETURNING *', [user_id, amount, 'pending', priority_shipping, backordered, discount_applied]);
  return result.rows[0];
};
