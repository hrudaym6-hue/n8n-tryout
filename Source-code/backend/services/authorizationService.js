const db = require('../config/database');

class AuthorizationService {
    async processAuthorization(authData) {
        const { accountId, cardNumber, transactionAmount, merchantId, merchantName, merchantCity, merchantZip } = authData;

        const accountResult = await db.query(
            'SELECT * FROM accounts WHERE account_id = $1',
            [accountId]
        );

        if (accountResult.rows.length === 0) {
            return {
                responseCode: '14',
                reasonCode: 'ACNT',
                approvedAmount: 0,
                message: 'Account not found'
            };
        }

        const account = accountResult.rows[0];

        if (account.account_status !== 'Y') {
            return {
                responseCode: '05',
                reasonCode: 'ACST',
                approvedAmount: 0,
                message: 'Account is not active'
            };
        }

        const cardResult = await db.query(
            'SELECT * FROM cards WHERE card_number = $1 AND account_id = $2',
            [cardNumber, accountId]
        );

        if (cardResult.rows.length === 0) {
            return {
                responseCode: '14',
                reasonCode: 'CARD',
                approvedAmount: 0,
                message: 'Card not found or does not belong to account'
            };
        }

        const card = cardResult.rows[0];

        if (card.card_status !== 'Y') {
            return {
                responseCode: '04',
                reasonCode: 'CDST',
                approvedAmount: 0,
                message: 'Card is not active'
            };
        }

        const availableCredit = account.credit_limit - account.current_balance;

        if (transactionAmount > availableCredit) {
            return {
                responseCode: '51',
                reasonCode: 'CRED',
                approvedAmount: 0,
                message: 'Insufficient credit available'
            };
        }

        if (transactionAmount > account.credit_limit) {
            return {
                responseCode: '61',
                reasonCode: 'LIMIT',
                approvedAmount: 0,
                message: 'Transaction amount exceeds credit limit'
            };
        }

        const authTime = new Date();
        const authResult = await db.query(
            `INSERT INTO authorizations (
                account_id, card_number, transaction_amount, 
                merchant_id, merchant_name, merchant_city, merchant_zip,
                auth_date, auth_time, response_code, approved_amount, reason_code
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *`,
            [
                accountId, cardNumber, transactionAmount,
                merchantId, merchantName, merchantCity, merchantZip,
                authTime, authTime, '00', transactionAmount, 'APPR'
            ]
        );

        await db.query(
            'UPDATE accounts SET current_balance = current_balance + $1, updated_at = CURRENT_TIMESTAMP WHERE account_id = $2',
            [transactionAmount, accountId]
        );

        return {
            responseCode: '00',
            reasonCode: 'APPR',
            approvedAmount: transactionAmount,
            message: 'Authorization approved',
            authId: authResult.rows[0].auth_id
        };
    }

    async getAuthorizationsByAccount(accountId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;

        const result = await db.query(
            `SELECT a.*, acc.customer_id, c.card_type
             FROM authorizations a
             JOIN accounts acc ON a.account_id = acc.account_id
             JOIN cards c ON a.card_number = c.card_number
             WHERE a.account_id = $1
             ORDER BY a.auth_date DESC, a.auth_time DESC
             LIMIT $2 OFFSET $3`,
            [accountId, limit, offset]
        );

        const countResult = await db.query(
            'SELECT COUNT(*) FROM authorizations WHERE account_id = $1',
            [accountId]
        );

        return {
            authorizations: result.rows,
            total: parseInt(countResult.rows[0].count),
            page: parseInt(page),
            limit: parseInt(limit)
        };
    }

    async getAuthorizationById(authId) {
        const result = await db.query(
            `SELECT a.*, acc.customer_id, c.card_type, cust.first_name, cust.last_name
             FROM authorizations a
             JOIN accounts acc ON a.account_id = acc.account_id
             JOIN cards c ON a.card_number = c.card_number
             JOIN customers cust ON acc.customer_id = cust.customer_id
             WHERE a.auth_id = $1`,
            [authId]
        );

        return result.rows[0] || null;
    }
}

module.exports = new AuthorizationService();
