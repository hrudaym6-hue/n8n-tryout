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
            SELECT a.*
            FROM authorizations a
            WHERE 1=1
        `;
        let params = [];
        let paramCount = 1;

        if (accountId) {
            query += ` AND a.account_id = $${paramCount}`;
            params.push(accountId);
            paramCount++;
        }

        if (cardNumber) {
            query += ` AND a.card_number = $${paramCount}`;
            params.push(cardNumber);
            paramCount++;
        }

        query += ` ORDER BY a.auth_date DESC, a.auth_time DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(limit, offset);

        const result = await db.query(query, params);
        
        let countQuery = 'SELECT COUNT(*) FROM authorizations WHERE 1=1';
        let countParams = [];
        let countNum = 1;
        
        if (accountId) {
            countQuery += ` AND account_id = $${countNum}`;
            countParams.push(accountId);
            countNum++;
        }
        if (cardNumber) {
            countQuery += ` AND card_number = $${countNum}`;
            countParams.push(cardNumber);
        }
        
        const countResult = await db.query(countQuery, countParams);

        res.json({
            authorizations: result.rows,
            total: parseInt(countResult.rows[0].count),
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (error) {
        console.error('Error fetching authorizations:', error);
        res.status(500).json({ error: 'Failed to fetch authorizations' });
    }
});

router.post('/', async (req, res) => {
    try {
        const {
            accountId, cardNumber, transactionAmount, merchantId,
            merchantName, merchantCity, merchantZip
        } = req.body;

        if (!accountId || !cardNumber || !transactionAmount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const accountResult = await db.query(
            'SELECT credit_limit, current_balance FROM accounts WHERE account_id = $1',
            [accountId]
        );

        if (accountResult.rows.length === 0) {
            return res.status(404).json({ error: 'Account not found' });
        }

        const account = accountResult.rows[0];
        const availableCredit = account.credit_limit - account.current_balance;
        const approved = transactionAmount <= availableCredit;

        const result = await db.query(`
            INSERT INTO authorizations (
                account_id, card_number, transaction_amount, merchant_id,
                merchant_name, merchant_city, merchant_zip, auth_date, auth_time,
                response_code, approved_amount, reason_code
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $8, $9, $10)
            RETURNING *
        `, [
            accountId, cardNumber, transactionAmount, merchantId,
            merchantName, merchantCity, merchantZip,
            approved ? '00' : '05',
            approved ? transactionAmount : 0,
            approved ? null : '4100'
        ]);

        res.status(201).json({
            ...result.rows[0],
            approved
        });
    } catch (error) {
        console.error('Error creating authorization:', error);
        res.status(500).json({ error: 'Failed to create authorization' });
    }
});

module.exports = router;
