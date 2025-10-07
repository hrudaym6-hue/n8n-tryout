const db = require('../config/database');
const { AppError } = require('../middleware/errorHandler');
const accountService = require('./account.service');

class TransactionService {
    generateTransactionId() {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return (timestamp + random).substring(0, 16);
    }

    async getAllTransactions(page = 1, limit = 10, filters = {}) {
        const offset = (page - 1) * limit;
        let query = `
            SELECT t.*, tt.type_description, tc.category_description,
                   a.customer_id, c.embossed_name
            FROM transactions t
            JOIN transaction_types tt ON t.transaction_type_code = tt.type_code
            JOIN transaction_categories tc ON t.transaction_category_code = tc.category_code
            JOIN accounts a ON t.account_id = a.account_id
            JOIN cards c ON t.card_number = c.card_number
        `;
        let countQuery = 'SELECT COUNT(*) FROM transactions t';
        let whereConditions = [];
        let params = [];
        let paramCount = 1;
        
        if (filters.transactionId) {
            whereConditions.push(`t.transaction_id = $${paramCount++}`);
            params.push(filters.transactionId);
        }
        if (filters.accountId) {
            whereConditions.push(`t.account_id = $${paramCount++}`);
            params.push(filters.accountId);
        }
        if (filters.cardNumber) {
            whereConditions.push(`t.card_number = $${paramCount++}`);
            params.push(filters.cardNumber);
        }
        
        if (whereConditions.length > 0) {
            const whereClause = ' WHERE ' + whereConditions.join(' AND ');
            query += whereClause;
            countQuery += whereClause;
        }
        
        query += ` ORDER BY t.process_date DESC, t.transaction_id DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
        params.push(limit, offset);
        
        const [transactionsResult, countResult] = await Promise.all([
            db.query(query, params),
            db.query(countQuery, params.slice(0, params.length - 2))
        ]);

        return {
            transactions: transactionsResult.rows,
            total: parseInt(countResult.rows[0].count),
            page: parseInt(page),
            limit: parseInt(limit)
        };
    }

    async getTransactionById(transactionId) {
        const result = await db.query(
            `SELECT t.*, tt.type_description, tc.category_description,
                    a.customer_id, c.embossed_name
             FROM transactions t
             JOIN transaction_types tt ON t.transaction_type_code = tt.type_code
             JOIN transaction_categories tc ON t.transaction_category_code = tc.category_code
             JOIN accounts a ON t.account_id = a.account_id
             JOIN cards c ON t.card_number = c.card_number
             WHERE t.transaction_id = $1`,
            [transactionId]
        );

        if (result.rows.length === 0) {
            throw new AppError('Transaction ID NOT found...', 404);
        }

        return result.rows[0];
    }

    async createTransaction(transactionData) {
        const {
            accountId, cardNumber, transactionTypeCode, transactionCategoryCode,
            transactionSource, transactionDescription, transactionAmount,
            merchantId, merchantName, merchantCity, merchantZip,
            originDate, processDate
        } = transactionData;

        const accountExists = await db.query(
            'SELECT account_id FROM accounts WHERE account_id = $1',
            [accountId]
        );

        if (accountExists.rows.length === 0) {
            throw new AppError('Did not find this account in account master file', 404);
        }

        const cardExists = await db.query(
            'SELECT card_number FROM cards WHERE card_number = $1',
            [cardNumber]
        );

        if (cardExists.rows.length === 0) {
            throw new AppError('Card number not provided', 404);
        }

        const transactionId = this.generateTransactionId();

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
             merchantZip, originDate, processDate || new Date()]
        );

        if (transactionTypeCode === '03' || transactionTypeCode === '04') {
            await accountService.updateAccountBalance(accountId, transactionAmount, 'debit');
        } else if (transactionTypeCode === '02' || transactionTypeCode === '07' || transactionTypeCode === '08') {
            await accountService.updateAccountBalance(accountId, transactionAmount, 'credit');
        }

        return result.rows[0];
    }

    async getTransactionTypes() {
        const result = await db.query(
            'SELECT * FROM transaction_types ORDER BY type_code'
        );
        return result.rows;
    }

    async getTransactionCategories() {
        const result = await db.query(
            'SELECT * FROM transaction_categories ORDER BY category_code'
        );
        return result.rows;
    }
}

module.exports = new TransactionService();
