const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM customers ORDER BY customer_id');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM customers WHERE customer_id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).json({ error: 'Failed to fetch customer' });
    }
});

module.exports = router;
