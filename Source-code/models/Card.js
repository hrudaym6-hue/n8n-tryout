const db = require('../config/database');

class Card {
    static async findByCardNumber(cardNumber) {
        const result = await db.query(
            'SELECT * FROM cards WHERE card_number = $1',
            [cardNumber]
        );
        return result.rows[0];
    }

    static async findByAccountId(accountId) {
        const result = await db.query(
            'SELECT * FROM cards WHERE account_id = $1 ORDER BY is_primary DESC, card_number',
            [accountId]
        );
        return result.rows;
    }

    static async findByCustomerId(customerId) {
        const result = await db.query(
            'SELECT * FROM cards WHERE customer_id = $1 ORDER BY is_primary DESC, card_number',
            [customerId]
        );
        return result.rows;
    }

    static async create(cardData) {
        const {
            cardNumber, accountId, customerId, cardType, expiryMonth,
            expiryYear, cvvCode, embossedName, cardStatus, isPrimary
        } = cardData;

        const result = await db.query(
            `INSERT INTO cards (
                card_number, account_id, customer_id, card_type, expiry_month,
                expiry_year, cvv_code, embossed_name, card_status, is_primary
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *`,
            [cardNumber, accountId, customerId, cardType, expiryMonth, expiryYear,
             cvvCode, embossedName, cardStatus, isPrimary || 'N']
        );
        return result.rows[0];
    }

    static async update(cardNumber, updates) {
        const fields = [];
        const values = [];
        let paramCount = 1;

        Object.keys(updates).forEach(key => {
            if (updates[key] !== undefined) {
                fields.push(`${this._toSnakeCase(key)} = $${paramCount}`);
                values.push(updates[key]);
                paramCount++;
            }
        });

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(cardNumber);

        const query = `
            UPDATE cards 
            SET ${fields.join(', ')}
            WHERE card_number = $${paramCount}
            RETURNING *
        `;

        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async validateCard(cardNumber) {
        const card = await this.findByCardNumber(cardNumber);
        
        if (!card) {
            return { valid: false, reason: 'CARD_NOT_FOUND', reasonCode: '3100' };
        }

        if (card.card_status !== 'Y') {
            return { valid: false, reason: 'CARD_NOT_ACTIVE', reasonCode: '4200' };
        }

        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const expiryYear = parseInt(card.expiry_year);
        const expiryMonth = parseInt(card.expiry_month);

        if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
            return { valid: false, reason: 'CARD_EXPIRED', reasonCode: '4200' };
        }

        return { valid: true, card };
    }

    static _toSnakeCase(str) {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }
}

module.exports = Card;
