const db = require('../config/database');

class TransactionService {
    generateTransactionId() {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return (timestamp + random).substring(0, 16);
    }

    async createTransaction(transactionData) {
        const {
            accountId, cardNumber, transactionTypeCode, transactionCategoryCode,
            transactionSource, transactionDescription, transactionAmount,
            merchantId, merchantName, merchantCity, merchantZip
        } = transactionData;

        const accountResult = await db.query(
            'SELECT * FROM accounts WHERE account_id = $1',
            [accountId]
        );

        if (accountResult.rows.length === 0) {
            throw new Error('Account not found');
        }

        const cardResult = await db.query(
            'SELECT * FROM cards WHERE card_number = $1',
            [cardNumber]
        );

        if (cardResult.rows.length === 0) {
            throw new Error('Card not found');
        }

        const transactionId = this.generateTransactionId();
        const originDate = new Date();
        const processDate = new Date();

        const result = await db.query(
            `INSERT INTO transactions (
                transaction_id, account_id, card_number, transaction_type_code,
                transaction_category_code, transaction_source, transaction_description,
                transaction_amount, merchant_id, merchant_name, merchant_city,
                merchant_zip, origin_date, process_date
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *`,
            [
                transactionId, accountId, cardNumber, transactionTypeCode,
                transactionCategoryCode, transactionSource, transactionDescription,
                transactionAmount, merchantId, merchantName, merchantCity,
                merchantZip, originDate, processDate
            ]
        );

        const account = accountResult.rows[0];
        const isDebit = ['03', '04', '05', '06'].includes(transactionTypeCode);
        const isCredit = ['02', '07', '08', '09'].includes(transactionTypeCode);

        if (isDebit) {
            await db.query(
                `UPDATE accounts 
                 SET current_balance = current_balance + $1,
                     current_cycle_debit = current_cycle_debit + $1,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE account_id = $2`,
                [transactionAmount, accountId]
            );
        } else if (isCredit) {
            await db.query(
                `UPDATE accounts 
                 SET current_balance = current_balance - $1,
                     current_cycle_credit = current_cycle_credit + $1,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE account_id = $2`,
                [transactionAmount, accountId]
            );
        }

        return result.rows[0];
    }

    async getTransactions(filters = {}, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        let query = `
            SELECT t.*, tt.type_description, tc.category_description,
                   a.customer_id, c.card_type
            FROM transactions t
            JOIN transaction_types tt ON t.transaction_type_code = tt.type_code
            JOIN transaction_categories tc ON t.transaction_category_code = tc.category_code
            JOIN accounts a ON t.account_id = a.account_id
            JOIN cards c ON t.card_number = c.card_number
            WHERE 1=1
        `;
        const params = [];
        let paramIndex = 1;

        if (filters.accountId) {
            query += ` AND t.account_id = $${paramIndex}`;
            params.push(filters.accountId);
            paramIndex++;
        }

        if (filters.cardNumber) {
            query += ` AND t.card_number = $${paramIndex}`;
            params.push(filters.cardNumber);
            paramIndex++;
        }

        if (filters.startDate) {
            query += ` AND t.process_date >= $${paramIndex}`;
            params.push(filters.startDate);
            paramIndex++;
        }

        if (filters.endDate) {
            query += ` AND t.process_date <= $${paramIndex}`;
            params.push(filters.endDate);
            paramIndex++;
        }

        query += ` ORDER BY t.process_date DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        const result = await db.query(query, params);

        let countQuery = 'SELECT COUNT(*) FROM transactions t WHERE 1=1';
        const countParams = [];
        let countParamIndex = 1;

        if (filters.accountId) {
            countQuery += ` AND t.account_id = $${countParamIndex}`;
            countParams.push(filters.accountId);
            countParamIndex++;
        }

        if (filters.cardNumber) {
            countQuery += ` AND t.card_number = $${countParamIndex}`;
            countParams.push(filters.cardNumber);
            countParamIndex++;
        }

        if (filters.startDate) {
            countQuery += ` AND t.process_date >= $${countParamIndex}`;
            countParams.push(filters.startDate);
            countParamIndex++;
        }

        if (filters.endDate) {
            countQuery += ` AND t.process_date <= $${countParamIndex}`;
            countParams.push(filters.endDate);
            countParamIndex++;
        }

        const countResult = await db.query(countQuery, countParams);

        return {
            transactions: result.rows,
            total: parseInt(countResult.rows[0].count),
            page: parseInt(page),
            limit: parseInt(limit)
        };
    }

    async getTransactionById(transactionId) {
        const result = await db.query(
            `SELECT t.*, tt.type_description, tc.category_description,
                    a.customer_id, c.card_type, cust.first_name, cust.last_name
             FROM transactions t
             JOIN transaction_types tt ON t.transaction_type_code = tt.type_code
             JOIN transaction_categories tc ON t.transaction_category_code = tc.category_code
             JOIN accounts a ON t.account_id = a.account_id
             JOIN cards c ON t.card_number = c.card_number
             JOIN customers cust ON a.customer_id = cust.customer_id
             WHERE t.transaction_id = $1`,
            [transactionId]
        );

        return result.rows[0] || null;
    }
}

module.exports = new TransactionService();
