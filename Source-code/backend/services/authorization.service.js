const db = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

class AuthorizationService {
    async getAllAuthorizations(page = 1, limit = 10, filters = {}) {
        const offset = (page - 1) * limit;
        let query = `
            SELECT auth.*, a.customer_id, a.credit_limit, a.current_balance,
                   c.embossed_name, c.card_status
            FROM authorizations auth
            JOIN accounts a ON auth.account_id = a.account_id
            JOIN cards c ON auth.card_number = c.card_number
        `;
        let countQuery = 'SELECT COUNT(*) FROM authorizations auth';
        let whereConditions = [];
        let params = [];
        let paramCount = 1;
        
        if (filters.accountId) {
            whereConditions.push(`auth.account_id = $${paramCount++}`);
            params.push(filters.accountId);
        }
        if (filters.cardNumber) {
            whereConditions.push(`auth.card_number = $${paramCount++}`);
            params.push(filters.cardNumber);
        }
        if (filters.responseCode) {
            whereConditions.push(`auth.response_code = $${paramCount++}`);
            params.push(filters.responseCode);
        }
        
        if (whereConditions.length > 0) {
            const whereClause = ' WHERE ' + whereConditions.join(' AND ');
            query += whereClause;
            countQuery += whereClause;
        }
        
        query += ` ORDER BY auth.auth_date DESC, auth.auth_id DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
        params.push(limit, offset);
        
        const [authorizationsResult, countResult] = await Promise.all([
            db.query(query, params),
            db.query(countQuery, params.slice(0, params.length - 2))
        ]);

        return {
            authorizations: authorizationsResult.rows,
            total: parseInt(countResult.rows[0].count),
            page: parseInt(page),
            limit: parseInt(limit)
        };
    }

    async getAuthorizationById(authId) {
        const result = await db.query(
            `SELECT auth.*, a.customer_id, a.credit_limit, a.current_balance,
                    c.embossed_name, c.card_status
             FROM authorizations auth
             JOIN accounts a ON auth.account_id = a.account_id
             JOIN cards c ON auth.card_number = c.card_number
             WHERE auth.auth_id = $1`,
            [authId]
        );

        if (result.rows.length === 0) {
            throw new AppError('Authorization not found', 404);
        }

        return result.rows[0];
    }

    async processAuthorization(authorizationData) {
        const {
            accountId, cardNumber, transactionAmount,
            merchantId, merchantName, merchantCity, merchantZip
        } = authorizationData;

        if (!accountId || accountId === '') {
            throw new AppError('Account ID cannot be empty', 400);
        }

        if (!cardNumber || cardNumber === '') {
            throw new AppError('Card number cannot be empty', 400);
        }

        const accountResult = await db.query(
            'SELECT * FROM accounts WHERE account_id = $1',
            [accountId]
        );

        if (accountResult.rows.length === 0) {
            return await this.createDeclinedAuthorization(
                accountId, cardNumber, transactionAmount,
                merchantId, merchantName, merchantCity, merchantZip,
                '05', 'ACCT'
            );
        }

        const account = accountResult.rows[0];

        if (account.account_status !== 'Y') {
            return await this.createDeclinedAuthorization(
                accountId, cardNumber, transactionAmount,
                merchantId, merchantName, merchantCity, merchantZip,
                '05', 'STAT'
            );
        }

        const cardResult = await db.query(
            'SELECT * FROM cards WHERE card_number = $1',
            [cardNumber]
        );

        if (cardResult.rows.length === 0) {
            return await this.createDeclinedAuthorization(
                accountId, cardNumber, transactionAmount,
                merchantId, merchantName, merchantCity, merchantZip,
                '05', 'CARD'
            );
        }

        const card = cardResult.rows[0];

        if (card.card_status !== 'Y') {
            return await this.createDeclinedAuthorization(
                accountId, cardNumber, transactionAmount,
                merchantId, merchantName, merchantCity, merchantZip,
                '05', 'STAT'
            );
        }

        const currentDate = new Date();
        const cardExpiryDate = new Date(`${card.expiry_year}-${card.expiry_month}-01`);
        
        if (cardExpiryDate < currentDate) {
            return await this.createDeclinedAuthorization(
                accountId, cardNumber, transactionAmount,
                merchantId, merchantName, merchantCity, merchantZip,
                '54', 'EXPR'
            );
        }

        const availableCredit = parseFloat(account.credit_limit) - parseFloat(account.current_balance);

        if (parseFloat(transactionAmount) > availableCredit) {
            if (availableCredit > 0) {
                return await this.createPartialAuthorization(
                    accountId, cardNumber, transactionAmount, availableCredit,
                    merchantId, merchantName, merchantCity, merchantZip
                );
            } else {
                return await this.createDeclinedAuthorization(
                    accountId, cardNumber, transactionAmount,
                    merchantId, merchantName, merchantCity, merchantZip,
                    '51', 'CRED'
                );
            }
        }

        return await this.createApprovedAuthorization(
            accountId, cardNumber, transactionAmount,
            merchantId, merchantName, merchantCity, merchantZip
        );
    }

    async createApprovedAuthorization(accountId, cardNumber, transactionAmount, 
                                     merchantId, merchantName, merchantCity, merchantZip) {
        const result = await db.query(
            `INSERT INTO authorizations (
                account_id, card_number, transaction_amount, merchant_id,
                merchant_name, merchant_city, merchant_zip,
                auth_date, auth_time, response_code, approved_amount, reason_code
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $8, $9, $10)
            RETURNING *`,
            [accountId, cardNumber, transactionAmount, merchantId,
             merchantName, merchantCity, merchantZip, '00', transactionAmount, null]
        );

        await db.query(
            `UPDATE accounts 
             SET current_balance = current_balance + $1, 
                 updated_at = CURRENT_TIMESTAMP
             WHERE account_id = $2`,
            [transactionAmount, accountId]
        );

        return result.rows[0];
    }

    async createPartialAuthorization(accountId, cardNumber, transactionAmount, approvedAmount,
                                     merchantId, merchantName, merchantCity, merchantZip) {
        const result = await db.query(
            `INSERT INTO authorizations (
                account_id, card_number, transaction_amount, merchant_id,
                merchant_name, merchant_city, merchant_zip,
                auth_date, auth_time, response_code, approved_amount, reason_code
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $8, $9, $10)
            RETURNING *`,
            [accountId, cardNumber, transactionAmount, merchantId,
             merchantName, merchantCity, merchantZip, '10', approvedAmount, 'PART']
        );

        await db.query(
            `UPDATE accounts 
             SET current_balance = current_balance + $1, 
                 updated_at = CURRENT_TIMESTAMP
             WHERE account_id = $2`,
            [approvedAmount, accountId]
        );

        return result.rows[0];
    }

    async createDeclinedAuthorization(accountId, cardNumber, transactionAmount,
                                     merchantId, merchantName, merchantCity, merchantZip,
                                     responseCode, reasonCode) {
        const result = await db.query(
            `INSERT INTO authorizations (
                account_id, card_number, transaction_amount, merchant_id,
                merchant_name, merchant_city, merchant_zip,
                auth_date, auth_time, response_code, approved_amount, reason_code
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $8, $9, $10)
            RETURNING *`,
            [accountId, cardNumber, transactionAmount, merchantId,
             merchantName, merchantCity, merchantZip, responseCode, 0, reasonCode]
        );

        return result.rows[0];
    }

    async deleteAuthorization(authId) {
        const result = await db.query(
            'DELETE FROM authorizations WHERE auth_id = $1 RETURNING auth_id',
            [authId]
        );

        if (result.rows.length === 0) {
            throw new AppError('Authorization not found', 404);
        }

        return { message: 'Authorization deleted successfully' };
    }
}

module.exports = new AuthorizationService();
