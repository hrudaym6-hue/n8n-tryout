const db = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

class CardService {
    generateCardNumber() {
        let cardNumber = '';
        for (let i = 0; i < 16; i++) {
            cardNumber += Math.floor(Math.random() * 10);
        }
        return cardNumber;
    }

    async getAllCards(page = 1, limit = 10, filters = {}) {
        const offset = (page - 1) * limit;
        let query = `
            SELECT c.*, a.current_balance, a.credit_limit, cu.first_name, cu.last_name
            FROM cards c
            JOIN accounts a ON c.account_id = a.account_id
            JOIN customers cu ON c.customer_id = cu.customer_id
        `;
        let countQuery = 'SELECT COUNT(*) FROM cards c';
        let whereConditions = [];
        let params = [];
        let paramCount = 1;
        
        if (filters.cardNumber) {
            whereConditions.push(`c.card_number = $${paramCount++}`);
            params.push(filters.cardNumber);
        }
        if (filters.accountId) {
            whereConditions.push(`c.account_id = $${paramCount++}`);
            params.push(filters.accountId);
        }
        if (filters.customerId) {
            whereConditions.push(`c.customer_id = $${paramCount++}`);
            params.push(filters.customerId);
        }
        
        if (whereConditions.length > 0) {
            const whereClause = ' WHERE ' + whereConditions.join(' AND ');
            query += whereClause;
            countQuery += whereClause;
        }
        
        query += ` ORDER BY c.card_number LIMIT $${paramCount++} OFFSET $${paramCount++}`;
        params.push(limit, offset);
        
        const [cardsResult, countResult] = await Promise.all([
            db.query(query, params),
            db.query(countQuery, params.slice(0, params.length - 2))
        ]);

        return {
            cards: cardsResult.rows,
            total: parseInt(countResult.rows[0].count),
            page: parseInt(page),
            limit: parseInt(limit)
        };
    }

    async getCardByNumber(cardNumber) {
        const result = await db.query(
            `SELECT c.*, a.current_balance, a.credit_limit, cu.first_name, cu.last_name
             FROM cards c
             JOIN accounts a ON c.account_id = a.account_id
             JOIN customers cu ON c.customer_id = cu.customer_id
             WHERE c.card_number = $1`,
            [cardNumber]
        );

        if (result.rows.length === 0) {
            throw new AppError('Card number not provided', 404);
        }

        return result.rows[0];
    }

    async createCard(cardData) {
        const { accountId, customerId, cardType, expiryMonth, expiryYear, 
                cvvCode, embossedName, cardStatus, isPrimary } = cardData;

        const accountExists = await db.query(
            'SELECT account_id FROM accounts WHERE account_id = $1',
            [accountId]
        );

        if (accountExists.rows.length === 0) {
            throw new AppError('Did not find this account in account master file', 404);
        }

        const customerExists = await db.query(
            'SELECT customer_id FROM customers WHERE customer_id = $1',
            [customerId]
        );

        if (customerExists.rows.length === 0) {
            throw new AppError('Did not find associated customer in master file', 404);
        }

        const cardNumber = this.generateCardNumber();

        const result = await db.query(
            `INSERT INTO cards (
                card_number, account_id, customer_id, card_type, expiry_month, expiry_year,
                cvv_code, embossed_name, card_status, is_primary
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *`,
            [cardNumber, accountId, customerId, cardType, expiryMonth, expiryYear,
             cvvCode, embossedName, cardStatus, isPrimary || 'N']
        );

        await db.query(
            'INSERT INTO card_xref (card_number, account_id) VALUES ($1, $2)',
            [cardNumber, accountId]
        );

        return result.rows[0];
    }

    async updateCard(cardNumber, cardData) {
        const existingCard = await db.query(
            'SELECT * FROM cards WHERE card_number = $1',
            [cardNumber]
        );

        if (existingCard.rows.length === 0) {
            throw new AppError('Card number not provided', 404);
        }

        const updates = [];
        const values = [];
        let paramCount = 1;

        const fields = {
            cardType: 'card_type',
            expiryMonth: 'expiry_month',
            expiryYear: 'expiry_year',
            cvvCode: 'cvv_code',
            embossedName: 'embossed_name',
            cardStatus: 'card_status',
            isPrimary: 'is_primary'
        };

        for (const [key, dbField] of Object.entries(fields)) {
            if (cardData[key] !== undefined) {
                updates.push(`${dbField} = $${paramCount++}`);
                values.push(cardData[key]);
            }
        }

        if (updates.length === 0) {
            throw new AppError('No fields to update', 400);
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(cardNumber);

        const result = await db.query(
            `UPDATE cards SET ${updates.join(', ')} WHERE card_number = $${paramCount}
             RETURNING *`,
            values
        );

        return result.rows[0];
    }

    async deleteCard(cardNumber) {
        const result = await db.query(
            'DELETE FROM cards WHERE card_number = $1 RETURNING card_number',
            [cardNumber]
        );

        if (result.rows.length === 0) {
            throw new AppError('Card number not provided', 404);
        }

        return { message: 'Card deleted successfully' };
    }
}

module.exports = new CardService();
