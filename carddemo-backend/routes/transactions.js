const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, accountId, cardNumber, startDate, endDate } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT t.*, tt.type_description, tc.category_description
            FROM transactions t
            LEFT JOIN transaction_types tt ON t.transaction_type_code = tt.type_code
            LEFT JOIN transaction_categories tc ON t.transaction_category_code = tc.category_code
            WHERE 1=1
        `;
        let params = [];
        let paramCount = 1;

        if (accountId) {
            query += ` AND t.account_id = $${paramCount}`;
            params.push(accountId);
            paramCount++;
        }

        if (cardNumber) {
            query += ` AND t.card_number = $${paramCount}`;
            params.push(cardNumber);
            paramCount++;
        }

        if (startDate) {
            query += ` AND t.process_date >= $${paramCount}`;
            params.push(startDate);
            paramCount++;
        }

        if (endDate) {
            query += ` AND t.process_date <= $${paramCount}`;
            params.push(endDate);
            paramCount++;
        }

        query += ` ORDER BY t.process_date DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(limit, offset);

        const result = await db.query(query, params);
        
        let countQuery = 'SELECT COUNT(*) FROM transactions WHERE 1=1';
        let countParams = [];
        let countParamNum = 1;
        
        if (accountId) {
            countQuery += ` AND account_id = $${countParamNum}`;
            countParams.push(accountId);
            countParamNum++;
        }
        if (cardNumber) {
            countQuery += ` AND card_number = $${countParamNum}`;
            countParams.push(cardNumber);
            countParamNum++;
        }
        if (startDate) {
            countQuery += ` AND process_date >= $${countParamNum}`;
            countParams.push(startDate);
            countParamNum++;
        }
        if (endDate) {
            countQuery += ` AND process_date <= $${countParamNum}`;
            countParams.push(endDate);
        }
        
        const countResult = await db.query(countQuery, countParams);

        res.json({
            transactions: result.rows,
            total: parseInt(countResult.rows[0].count),
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(`
            SELECT t.*, tt.type_description, tc.category_description
            FROM transactions t
            LEFT JOIN transaction_types tt ON t.transaction_type_code = tt.type_code
            LEFT JOIN transaction_categories tc ON t.transaction_category_code = tc.category_code
            WHERE t.transaction_id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching transaction:', error);
        res.status(500).json({ error: 'Failed to fetch transaction' });
    }
});

router.post('/', async (req, res) => {
    try {
        const {
            accountId, cardNumber, transactionTypeCode, transactionCategoryCode,
            transactionAmount, merchantId, merchantName, merchantCity, merchantZip,
            transactionDescription
        } = req.body;

        if (!accountId || !cardNumber || !transactionTypeCode || !transactionCategoryCode || !transactionAmount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const transactionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);

        const result = await db.query(`
            INSERT INTO transactions (
                transaction_id, account_id, card_number, transaction_type_code,
                transaction_category_code, transaction_amount, merchant_id,
                merchant_name, merchant_city, merchant_zip, transaction_description,
                origin_date, process_date
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING *
        `, [
            transactionId, accountId, cardNumber, transactionTypeCode,
            transactionCategoryCode, transactionAmount, merchantId,
            merchantName, merchantCity, merchantZip, transactionDescription
        ]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: 'Failed to create transaction' });
    }
});

module.exports = router;
