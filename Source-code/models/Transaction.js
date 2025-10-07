const db = require('../config/database');

class Transaction {
    static async findById(transactionId) {
        const result = await db.query(
            `SELECT t.*, tt.type_description, tc.category_description
             FROM transactions t
             LEFT JOIN transaction_types tt ON t.transaction_type_code = tt.type_code
             LEFT JOIN transaction_categories tc ON t.transaction_category_code = tc.category_code
             WHERE t.transaction_id = $1`,
            [transactionId]
        );
        return result.rows[0];
    }

    static async findByAccountId(accountId, options = {}) {
        const { page = 1, limit = 10, startDate, endDate } = options;
        const offset = (page - 1) * limit;

        let query = `
            SELECT t.*, tt.type_description, tc.category_description
            FROM transactions t
            LEFT JOIN transaction_types tt ON t.transaction_type_code = tt.type_code
            LEFT JOIN transaction_categories tc ON t.transaction_category_code = tc.category_code
            WHERE t.account_id = $1
        `;
        const params = [accountId];
        let paramCount = 2;

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

        let countQuery = 'SELECT COUNT(*) FROM transactions WHERE account_id = $1';
        const countParams = [accountId];
        let countParamCount = 2;

        if (startDate) {
            countQuery += ` AND process_date >= $${countParamCount}`;
            countParams.push(startDate);
            countParamCount++;
        }

        if (endDate) {
            countQuery += ` AND process_date <= $${countParamCount}`;
            countParams.push(endDate);
        }

        const countResult = await db.query(countQuery, countParams);

        return {
            transactions: result.rows,
            total: parseInt(countResult.rows[0].count),
            page,
            limit
        };
    }

    static async create(transactionData) {
        const {
            transactionId, accountId, cardNumber, transactionTypeCode,
            transactionCategoryCode, transactionSource, transactionDescription,
            transactionAmount, merchantId, merchantName, merchantCity,
            merchantZip, originDate, processDate
        } = transactionData;

        const result = await db.query(
            `INSERT INTO transactions (
                transaction_id, account_id, card_number, transaction_type_code,
                transaction_category_code, transaction_source, transaction_description,
                transaction_amount, merchant_id, merchant_name, merchant_city,
                merchant_zip, origin_date, process_date
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *`,
            [transactionId, accountId, cardNumber, transactionTypeCode,
             transactionCategoryCode, transactionSource, transactionDescription,
             transactionAmount, merchantId, merchantName, merchantCity,
             merchantZip, originDate, processDate]
        );
        return result.rows[0];
    }

    static async getNextTransactionId() {
        const result = await db.query(
            'SELECT transaction_id FROM transactions ORDER BY transaction_id DESC LIMIT 1'
        );
        
        if (result.rows.length === 0) {
            return '0000000000000001';
        }

        const lastId = parseInt(result.rows[0].transaction_id);
        const nextId = (lastId + 1).toString().padStart(16, '0');
        return nextId;
    }
}

module.exports = Transaction;
