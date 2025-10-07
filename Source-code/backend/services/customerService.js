const db = require('../config/database');

class CustomerService {
    async getAllCustomers(page = 1, limit = 10) {
        const offset = (page - 1) * limit;

        const result = await db.query(
            `SELECT * FROM customers
             ORDER BY customer_id
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        const countResult = await db.query('SELECT COUNT(*) FROM customers');

        return {
            customers: result.rows,
            total: parseInt(countResult.rows[0].count),
            page: parseInt(page),
            limit: parseInt(limit)
        };
    }

    async getCustomerById(customerId) {
        const result = await db.query(
            'SELECT * FROM customers WHERE customer_id = $1',
            [customerId]
        );

        return result.rows[0] || null;
    }

    async createCustomer(customerData) {
        const {
            customerId, firstName, lastName, dateOfBirth, phoneNumber,
            ssn, email, addressLine1, addressLine2, city, state,
            zipCode, ficoCreditScore
        } = customerData;

        const result = await db.query(
            `INSERT INTO customers (
                customer_id, first_name, last_name, date_of_birth, phone_number,
                ssn, email, address_line1, address_line2, city, state,
                zip_code, fico_credit_score
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING *`,
            [
                customerId, firstName, lastName, dateOfBirth, phoneNumber,
                ssn, email, addressLine1, addressLine2, city, state,
                zipCode, ficoCreditScore
            ]
        );

        return result.rows[0];
    }

    async updateCustomer(customerId, updateData) {
        const fields = [];
        const values = [];
        let paramIndex = 1;

        const allowedFields = [
            'first_name', 'last_name', 'date_of_birth', 'phone_number',
            'ssn', 'email', 'address_line1', 'address_line2', 'city',
            'state', 'zip_code', 'fico_credit_score'
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
        values.push(customerId);

        const query = `
            UPDATE customers
            SET ${fields.join(', ')}
            WHERE customer_id = $${paramIndex}
            RETURNING *
        `;

        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            throw new Error('Customer not found');
        }

        return result.rows[0];
    }
}

module.exports = new CustomerService();
