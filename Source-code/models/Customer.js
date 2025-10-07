const db = require('../config/database');

class Customer {
    static async findById(customerId) {
        const result = await db.query(
            'SELECT * FROM customers WHERE customer_id = $1',
            [customerId]
        );
        return result.rows[0];
    }

    static async findAll(options = {}) {
        const { page = 1, limit = 10, search } = options;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM customers WHERE 1=1';
        const params = [];
        let paramCount = 1;

        if (search) {
            query += ` AND (first_name ILIKE $${paramCount} OR last_name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
            params.push(`%${search}%`);
            paramCount++;
        }

        query += ` ORDER BY customer_id LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(limit, offset);

        const result = await db.query(query, params);
        
        const countQuery = search 
            ? 'SELECT COUNT(*) FROM customers WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1'
            : 'SELECT COUNT(*) FROM customers';
        const countParams = search ? [`%${search}%`] : [];
        const countResult = await db.query(countQuery, countParams);

        return {
            customers: result.rows,
            total: parseInt(countResult.rows[0].count),
            page,
            limit
        };
    }

    static async create(customerData) {
        const {
            customerId, firstName, lastName, dateOfBirth, phoneNumber,
            email, addressLine1, addressLine2, city, state, zipCode, ficoCreditScore
        } = customerData;

        const result = await db.query(
            `INSERT INTO customers (
                customer_id, first_name, last_name, date_of_birth, phone_number,
                email, address_line1, address_line2, city, state, zip_code, fico_credit_score
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *`,
            [customerId, firstName, lastName, dateOfBirth, phoneNumber,
             email, addressLine1, addressLine2, city, state, zipCode, ficoCreditScore]
        );
        return result.rows[0];
    }

    static async update(customerId, updates) {
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
        values.push(customerId);

        const query = `
            UPDATE customers 
            SET ${fields.join(', ')}
            WHERE customer_id = $${paramCount}
            RETURNING *
        `;

        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async delete(customerId) {
        const result = await db.query(
            'DELETE FROM customers WHERE customer_id = $1 RETURNING *',
            [customerId]
        );
        return result.rows[0];
    }

    static _toSnakeCase(str) {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }
}

module.exports = Customer;
