const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM transaction_types ORDER BY type_code');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching transaction types:', error);
        res.status(500).json({ error: 'Failed to fetch transaction types' });
    }
});

router.get('/:code', async (req, res) => {
    try {
        const { code } = req.params;
        const result = await db.query('SELECT * FROM transaction_types WHERE type_code = $1', [code]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Transaction type not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching transaction type:', error);
        res.status(500).json({ error: 'Failed to fetch transaction type' });
    }
});

router.post('/', requireAdmin, async (req, res) => {
    try {
        const { typeCode, typeDescription } = req.body;

        if (!typeCode || !typeDescription) {
            return res.status(400).json({ error: 'Type code and description are required' });
        }

        if (typeCode.length !== 2) {
            return res.status(400).json({ error: 'Type code must be 2 characters' });
        }

        const result = await db.query(
            'INSERT INTO transaction_types (type_code, type_description) VALUES ($1, $2) RETURNING *',
            [typeCode, typeDescription]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ error: 'Transaction type already exists' });
        }
        console.error('Error creating transaction type:', error);
        res.status(500).json({ error: 'Failed to create transaction type' });
    }
});

router.put('/:code', requireAdmin, async (req, res) => {
    try {
        const { code } = req.params;
        const { typeDescription } = req.body;

        if (!typeDescription) {
            return res.status(400).json({ error: 'Description is required' });
        }

        const result = await db.query(
            'UPDATE transaction_types SET type_description = $1, updated_at = CURRENT_TIMESTAMP WHERE type_code = $2 RETURNING *',
            [typeDescription, code]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Transaction type not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating transaction type:', error);
        res.status(500).json({ error: 'Failed to update transaction type' });
    }
});

router.delete('/:code', requireAdmin, async (req, res) => {
    try {
        const { code } = req.params;

        const result = await db.query('DELETE FROM transaction_types WHERE type_code = $1 RETURNING *', [code]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Transaction type not found' });
        }

        res.json({ message: 'Transaction type deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction type:', error);
        res.status(500).json({ error: 'Failed to delete transaction type' });
    }
});

module.exports = router;
