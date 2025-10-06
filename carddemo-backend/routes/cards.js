const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, accountId, cardNumber } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT c.*, a.account_id, cu.first_name, cu.last_name
            FROM cards c
            JOIN accounts a ON c.account_id = a.account_id
            JOIN customers cu ON c.customer_id = cu.customer_id
            WHERE 1=1
        `;
        let params = [];
        let paramCount = 1;

        if (accountId) {
            query += ` AND c.account_id = $${paramCount}`;
            params.push(accountId);
            paramCount++;
        }

        if (cardNumber) {
            query += ` AND c.card_number = $${paramCount}`;
            params.push(cardNumber);
            paramCount++;
        }

        query += ` ORDER BY c.card_number LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(limit, offset);

        const result = await db.query(query, params);
        const countQuery = 'SELECT COUNT(*) FROM cards WHERE 1=1' + 
            (accountId ? ' AND account_id = $1' : '') + 
            (cardNumber ? ' AND card_number = $' + (accountId ? '2' : '1') : '');
        const countParams = [accountId, cardNumber].filter(Boolean);
        const countResult = await db.query(countQuery, countParams);

        res.json({
            cards: result.rows,
            total: parseInt(countResult.rows[0].count),
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (error) {
        console.error('Error fetching cards:', error);
        res.status(500).json({ error: 'Failed to fetch cards' });
    }
});

router.get('/:cardNumber', async (req, res) => {
    try {
        const { cardNumber } = req.params;

        const result = await db.query(`
            SELECT c.*, a.account_id, a.credit_limit, a.current_balance,
                   cu.first_name, cu.last_name, cu.email
            FROM cards c
            JOIN accounts a ON c.account_id = a.account_id
            JOIN customers cu ON c.customer_id = cu.customer_id
            WHERE c.card_number = $1
        `, [cardNumber]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Card not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching card:', error);
        res.status(500).json({ error: 'Failed to fetch card' });
    }
});

router.put('/:cardNumber', async (req, res) => {
    try {
        const { cardNumber } = req.params;
        const { cardStatus, expiryMonth, expiryYear } = req.body;

        const result = await db.query(`
            UPDATE cards
            SET card_status = COALESCE($1, card_status),
                expiry_month = COALESCE($2, expiry_month),
                expiry_year = COALESCE($3, expiry_year),
                updated_at = CURRENT_TIMESTAMP
            WHERE card_number = $4
            RETURNING *
        `, [cardStatus, expiryMonth, expiryYear, cardNumber]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Card not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating card:', error);
        res.status(500).json({ error: 'Failed to update card' });
    }
});

module.exports = router;
