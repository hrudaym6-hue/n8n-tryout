const db = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

class CustomerService {
    async getAllCustomers(page = 1, limit = 10, customerId = null) {
        const offset = (page - 1) * limit;
        let query = 'SELECT * FROM customers';
        let countQuery = 'SELECT COUNT(*) FROM customers';
        let params = [];
        
        if (customerId) {
            query += ' WHERE customer_id = $1';
            countQuery += ' WHERE customer_id = $1';
            params.push(customerId);
        }
        
        query += ' ORDER BY customer_id LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
        params.push(limit, offset);
        
        const [customersResult, countResult] = await Promise.all([
            db.query(query, params),
            db.query(countQuery, customerId ? [customerId] : [])
        ]);

        return {
            customers: customersResult.rows,
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

        if (result.rows.length === 0) {
            throw new AppError('Did not find associated customer in master file', 404);
        }

        return result.rows[0];
    }

    async createCustomer(customerData) {
        const {
            firstName, lastName, dateOfBirth, phoneNumber, email,
            addressLine1, addressLine2, city, state, zipCode, ssn, ficoScore
        } = customerData;

        const result = await db.query(
            `INSERT INTO customers (
                first_name, last_name, date_of_birth, phone_number, email,
                address_line1, address_line2, city, state, zip_code, ssn, fico_credit_score
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *`,
            [firstName, lastName, dateOfBirth, phoneNumber, email,
             addressLine1, addressLine2, city, state, zipCode, ssn, ficoScore]
        );

        return result.rows[0];
    }

    async updateCustomer(customerId, customerData) {
        const existingCustomer = await db.query(
            'SELECT * FROM customers WHERE customer_id = $1',
            [customerId]
        );

        if (existingCustomer.rows.length === 0) {
            throw new AppError('Did not find associated customer in master file', 404);
        }

        const updates = [];
        const values = [];
        let paramCount = 1;

        const fields = {
            firstName: 'first_name',
            lastName: 'last_name',
            dateOfBirth: 'date_of_birth',
            phoneNumber: 'phone_number',
            email: 'email',
            addressLine1: 'address_line1',
            addressLine2: 'address_line2',
            city: 'city',
            state: 'state',
            zipCode: 'zip_code',
            ssn: 'ssn',
            ficoScore: 'fico_credit_score'
        };

        for (const [key, dbField] of Object.entries(fields)) {
            if (customerData[key] !== undefined) {
                updates.push(`${dbField} = $${paramCount++}`);
                values.push(customerData[key]);
            }
        }

        if (updates.length === 0) {
            throw new AppError('No fields to update', 400);
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(customerId);

        const result = await db.query(
            `UPDATE customers SET ${updates.join(', ')} WHERE customer_id = $${paramCount}
             RETURNING *`,
            values
        );

        return result.rows[0];
    }

    async deleteCustomer(customerId) {
        const result = await db.query(
            'DELETE FROM customers WHERE customer_id = $1 RETURNING customer_id',
            [customerId]
        );

        if (result.rows.length === 0) {
            throw new AppError('Did not find associated customer in master file', 404);
        }

        return { message: 'Customer deleted successfully' };
    }
}

module.exports = new CustomerService();
