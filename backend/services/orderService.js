const { pool } = require('../models');

exports.createOrder = async ({ user_id, amount, backordered }) => {
  let priority_shipping = false;
  let discount_applied = false;
  // Fetch loyalty_level for discount
  const user = await pool.query('SELECT loyalty_level FROM users WHERE id=$1', [user_id]);
  if (user.rows[0] && user.rows[0].loyalty_level === 'gold') discount_applied = true;
  // Business: No shipping for backordered
  if (!backordered && amount > 100) priority_shipping = true;

  const result = await pool.query(
    'INSERT INTO orders (user_id, amount, status, priority_shipping, backordered, discount_applied) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [user_id, amount, 'pending', priority_shipping, backordered, discount_applied]
  );
  return result.rows[0];
};
