const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, accountId } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT a.*, c.first_name, c.last_name, c.email
            FROM accounts a
            JOIN customers c ON a.customer_id = c.customer_id
        `;
        let params = [];

        if (accountId) {
            query += ' WHERE a.account_id = $1';
            params.push(accountId);
        }

        query += ' ORDER BY a.account_id LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
        params.push(limit, offset);

        const result = await db.query(query, params);
        const countResult = await db.query('SELECT COUNT(*) FROM accounts' + (accountId ? ' WHERE account_id = $1' : ''), accountId ? [accountId] : []);

        res.json({
            accounts: result.rows,
            total: parseInt(countResult.rows[0].count),
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ error: 'Failed to fetch accounts' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(`
            SELECT a.*, c.first_name, c.last_name, c.email, c.phone_number
            FROM accounts a
            JOIN customers c ON a.customer_id = c.customer_id
            WHERE a.account_id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Account not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching account:', error);
        res.status(500).json({ error: 'Failed to fetch account' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { accountStatus, creditLimit, cashCreditLimit } = req.body;

        const result = await db.query(`
            UPDATE accounts
            SET account_status = COALESCE($1, account_status),
                credit_limit = COALESCE($2, credit_limit),
                cash_credit_limit = COALESCE($3, cash_credit_limit),
                updated_at = CURRENT_TIMESTAMP
            WHERE account_id = $4
            RETURNING *
        `, [accountStatus, creditLimit, cashCreditLimit, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Account not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({ error: 'Failed to update account' });
    }
});

module.exports = router;
