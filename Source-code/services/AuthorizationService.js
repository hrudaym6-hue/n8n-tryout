const db = require('../config/database');
const logger = require('../config/logger');
const Account = require('../models/Account');
const Card = require('../models/Card');

class AuthorizationService {
    constructor() {
        this.RESPONSE_CODES = {
            APPROVED: '00',
            DECLINED: '05'
        };

        this.REASON_CODES = {
            CARD_NOT_FOUND: '3100',
            INSUFFICIENT_FUNDS: '4100',
            CARD_NOT_ACTIVE: '4200',
            ACCOUNT_CLOSED: '4300',
            CARD_FRAUD: '5100',
            MERCHANT_FRAUD: '5200',
            UNKNOWN: '9000'
        };
    }

    async processAuthorization(authRequest) {
        const {
            accountId,
            cardNumber,
            transactionAmount,
            merchantId,
            merchantName,
            merchantCity,
            merchantZip
        } = authRequest;

        logger.info('Processing authorization', { accountId, cardNumber, transactionAmount });

        const declineReasons = [];
        let responseCode = this.RESPONSE_CODES.APPROVED;
        let reasonCode = null;
        let approvedAmount = transactionAmount;

        const cardValidation = await Card.validateCard(cardNumber);
        if (!cardValidation.valid) {
            declineReasons.push(cardValidation.reason);
            responseCode = this.RESPONSE_CODES.DECLINED;
            reasonCode = cardValidation.reasonCode;
            approvedAmount = 0;
        }

        if (responseCode === this.RESPONSE_CODES.APPROVED) {
            const account = await Account.findById(accountId);
            
            if (!account) {
                declineReasons.push('ACCOUNT_NOT_FOUND');
                responseCode = this.RESPONSE_CODES.DECLINED;
                reasonCode = this.REASON_CODES.UNKNOWN;
                approvedAmount = 0;
                logger.warn('Account not found', { accountId });
            } else {
                if (account.account_status !== 'Y') {
                    declineReasons.push('ACCOUNT_CLOSED');
                    responseCode = this.RESPONSE_CODES.DECLINED;
                    reasonCode = this.REASON_CODES.ACCOUNT_CLOSED;
                    approvedAmount = 0;
                    logger.warn('Account closed', { accountId });
                } else {
                    const availableCredit = this._calculateAvailableCredit(account);
                    
                    if (transactionAmount > availableCredit) {
                        declineReasons.push('INSUFFICIENT_FUNDS');
                        responseCode = this.RESPONSE_CODES.DECLINED;
                        reasonCode = this.REASON_CODES.INSUFFICIENT_FUNDS;
                        approvedAmount = 0;
                        logger.warn('Insufficient funds', { 
                            accountId, 
                            transactionAmount, 
                            availableCredit 
                        });
                    }
                }
            }
        }

        const authDate = new Date();
        const authTime = new Date();
        
        const authDateComplement = this._calculateDateComplement(authDate);
        const authTimeComplement = this._calculateTimeComplement(authTime);

        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            const insertResult = await client.query(
                `INSERT INTO authorizations (
                    account_id, card_number, transaction_amount,
                    merchant_id, merchant_name, merchant_city, merchant_zip,
                    auth_date, auth_time, response_code, approved_amount, reason_code
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING *`,
                [
                    accountId, cardNumber, transactionAmount,
                    merchantId, merchantName, merchantCity, merchantZip,
                    authDate, authTime, responseCode, approvedAmount, reasonCode
                ]
            );

            const authorization = insertResult.rows[0];

            if (responseCode === this.RESPONSE_CODES.APPROVED) {
                await this._updateAuthorizationSummary(client, accountId, cardNumber, approvedAmount, true);
                
                await client.query(
                    `UPDATE accounts 
                     SET current_balance = current_balance + $1,
                         updated_at = CURRENT_TIMESTAMP
                     WHERE account_id = $2`,
                    [approvedAmount, accountId]
                );
                
                logger.info('Authorization approved', { 
                    authId: authorization.auth_id, 
                    accountId, 
                    approvedAmount 
                });
            } else {
                await this._updateAuthorizationSummary(client, accountId, cardNumber, transactionAmount, false);
                
                logger.info('Authorization declined', { 
                    authId: authorization.auth_id, 
                    accountId, 
                    reasonCode,
                    reasons: declineReasons 
                });
            }

            await client.query('COMMIT');

            return {
                ...authorization,
                approved: responseCode === this.RESPONSE_CODES.APPROVED,
                declineReasons: declineReasons.length > 0 ? declineReasons : undefined
            };
        } catch (error) {
            await client.query('ROLLBACK');
            logger.error('Authorization processing error', { 
                error: error.message, 
                stack: error.stack,
                accountId,
                cardNumber 
            });
            throw error;
        } finally {
            client.release();
        }
    }

    _calculateAvailableCredit(account) {
        return account.credit_limit - account.current_balance;
    }

    _calculateDateComplement(date) {
        const year = date.getFullYear() % 100;
        const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
        const yyddd = year * 1000 + dayOfYear;
        return 99999 - yyddd;
    }

    _calculateTimeComplement(time) {
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();
        const milliseconds = time.getMilliseconds();
        const timeValue = hours * 10000000 + minutes * 100000 + seconds * 1000 + milliseconds;
        return 999999999 - timeValue;
    }

    async _updateAuthorizationSummary(client, accountId, cardNumber, amount, isApproved) {
        const summaryExists = await client.query(
            'SELECT * FROM authorization_summary WHERE account_id = $1 AND card_number = $2',
            [accountId, cardNumber]
        );

        if (summaryExists.rows.length === 0) {
            await client.query(
                `INSERT INTO authorization_summary (
                    account_id, card_number, 
                    approved_auth_count, approved_auth_amount,
                    declined_auth_count, declined_auth_amount,
                    credit_balance, cash_balance
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [
                    accountId, cardNumber,
                    isApproved ? 1 : 0, isApproved ? amount : 0,
                    isApproved ? 0 : 1, isApproved ? 0 : amount,
                    isApproved ? amount : 0, 0
                ]
            );
        } else {
            if (isApproved) {
                await client.query(
                    `UPDATE authorization_summary 
                     SET approved_auth_count = approved_auth_count + 1,
                         approved_auth_amount = approved_auth_amount + $1,
                         credit_balance = credit_balance + $1,
                         cash_balance = 0
                     WHERE account_id = $2 AND card_number = $3`,
                    [amount, accountId, cardNumber]
                );
            } else {
                await client.query(
                    `UPDATE authorization_summary 
                     SET declined_auth_count = declined_auth_count + 1,
                         declined_auth_amount = declined_auth_amount + $1
                     WHERE account_id = $2 AND card_number = $3`,
                    [amount, accountId, cardNumber]
                );
            }
        }
    }

    async purgeExpiredAuthorizations() {
        const expiryDays = parseInt(process.env.AUTHORIZATION_EXPIRY_DAYS) || 5;
        
        logger.info('Starting authorization purge', { expiryDays });

        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            const expiredAuths = await client.query(
                `SELECT * FROM authorizations 
                 WHERE auth_date < CURRENT_TIMESTAMP - INTERVAL '${expiryDays} days'`
            );

            for (const auth of expiredAuths.rows) {
                if (auth.response_code === this.RESPONSE_CODES.APPROVED) {
                    await client.query(
                        `UPDATE authorization_summary 
                         SET approved_auth_count = approved_auth_count - 1,
                             approved_auth_amount = approved_auth_amount - $1
                         WHERE account_id = $2 AND card_number = $3`,
                        [auth.approved_amount, auth.account_id, auth.card_number]
                    );
                } else {
                    await client.query(
                        `UPDATE authorization_summary 
                         SET declined_auth_count = declined_auth_count - 1,
                             declined_auth_amount = declined_auth_amount - $1
                         WHERE account_id = $2 AND card_number = $3`,
                        [auth.transaction_amount, auth.account_id, auth.card_number]
                    );
                }
            }

            const deleteResult = await client.query(
                `DELETE FROM authorizations 
                 WHERE auth_date < CURRENT_TIMESTAMP - INTERVAL '${expiryDays} days'`
            );

            await client.query('COMMIT');

            logger.info('Authorization purge completed', { 
                deletedCount: deleteResult.rowCount 
            });

            return { deletedCount: deleteResult.rowCount };
        } catch (error) {
            await client.query('ROLLBACK');
            logger.error('Authorization purge error', { 
                error: error.message, 
                stack: error.stack 
            });
            throw error;
        } finally {
            client.release();
        }
    }

    async getAuthorizationsByAccount(accountId, options = {}) {
        const { page = 1, limit = 10, cardNumber } = options;
        const offset = (page - 1) * limit;

        let query = `
            SELECT a.*, c.embossed_name, c.card_type
            FROM authorizations a
            LEFT JOIN cards c ON a.card_number = c.card_number
            WHERE a.account_id = $1
        `;
        const params = [accountId];
        let paramCount = 2;

        if (cardNumber) {
            query += ` AND a.card_number = $${paramCount}`;
            params.push(cardNumber);
            paramCount++;
        }

        query += ` ORDER BY a.auth_date DESC, a.auth_time DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(limit, offset);

        const result = await db.query(query, params);

        const countQuery = `
            SELECT COUNT(*) FROM authorizations 
            WHERE account_id = $1 ${cardNumber ? 'AND card_number = $2' : ''}
        `;
        const countParams = cardNumber ? [accountId, cardNumber] : [accountId];
        const countResult = await db.query(countQuery, countParams);

        return {
            authorizations: result.rows,
            total: parseInt(countResult.rows[0].count),
            page,
            limit,
            totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
        };
    }
}

module.exports = new AuthorizationService();
