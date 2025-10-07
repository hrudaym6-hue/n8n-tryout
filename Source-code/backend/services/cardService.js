const db = require('../config/database');

class CardService {
    async getCards(filters = {}, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        let query = `
            SELECT c.*, a.credit_limit, a.current_balance, cust.first_name, cust.last_name
            FROM cards c
            JOIN accounts a ON c.account_id = a.account_id
            JOIN customers cust ON c.customer_id = cust.customer_id
            WHERE 1=1
        `;
        const params = [];
        let paramIndex = 1;

        if (filters.cardNumber) {
            query += ` AND c.card_number = $${paramIndex}`;
            params.push(filters.cardNumber);
            paramIndex++;
        }

        if (filters.accountId) {
            query += ` AND c.account_id = $${paramIndex}`;
            params.push(filters.accountId);
            paramIndex++;
        }

        if (filters.customerId) {
            query += ` AND c.customer_id = $${paramIndex}`;
            params.push(filters.customerId);
            paramIndex++;
        }

        if (filters.cardStatus) {
            query += ` AND c.card_status = $${paramIndex}`;
            params.push(filters.cardStatus);
            paramIndex++;
        }

        query += ` ORDER BY c.card_number LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        const result = await db.query(query, params);

        let countQuery = 'SELECT COUNT(*) FROM cards c WHERE 1=1';
        const countParams = [];
        let countParamIndex = 1;

        if (filters.cardNumber) {
            countQuery += ` AND c.card_number = $${countParamIndex}`;
            countParams.push(filters.cardNumber);
            countParamIndex++;
        }

        if (filters.accountId) {
            countQuery += ` AND c.account_id = $${countParamIndex}`;
            countParams.push(filters.accountId);
            countParamIndex++;
        }

        if (filters.customerId) {
            countQuery += ` AND c.customer_id = $${countParamIndex}`;
            countParams.push(filters.customerId);
            countParamIndex++;
        }

        if (filters.cardStatus) {
            countQuery += ` AND c.card_status = $${countParamIndex}`;
            countParams.push(filters.cardStatus);
            countParamIndex++;
        }

        const countResult = await db.query(countQuery, countParams);

        return {
            cards: result.rows,
            total: parseInt(countResult.rows[0].count),
            page: parseInt(page),
            limit: parseInt(limit)
        };
    }

    async getCardByNumber(cardNumber) {
        const result = await db.query(
            `SELECT c.*, a.credit_limit, a.current_balance, a.account_status,
                    cust.first_name, cust.last_name, cust.email, cust.phone_number
             FROM cards c
             JOIN accounts a ON c.account_id = a.account_id
             JOIN customers cust ON c.customer_id = cust.customer_id
             WHERE c.card_number = $1`,
            [cardNumber]
        );

        return result.rows[0] || null;
    }

    async updateCard(cardNumber, updateData) {
        const fields = [];
        const values = [];
        let paramIndex = 1;

        const allowedFields = [
            'card_type', 'expiry_month', 'expiry_year', 'cvv_code',
            'embossed_name', 'card_status', 'is_primary'
        ];

        for (const field of allowedFields) {
            const camelCaseField = field.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
            if (updateData[camelCaseField] !== undefined) {
                fields.push(`${field} = $${paramIndex}`);
                values.push(updateData[camelCaseField]);
                paramIndex++;
            }
        }

        if (fields.length === 0) {
            throw new Error('No valid fields to update');
        }

        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(cardNumber);

        const query = `
            UPDATE cards
            SET ${fields.join(', ')}
            WHERE card_number = $${paramIndex}
            RETURNING *
        `;

        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            throw new Error('Card not found');
        }

        return result.rows[0];
    }
}

module.exports = new CardService();
