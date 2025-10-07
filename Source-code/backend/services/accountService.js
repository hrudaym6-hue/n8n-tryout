const db = require('../config/database');

class AccountService {
    async getAccounts(filters = {}, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        let query = `
            SELECT a.*, c.first_name, c.last_name, c.email, c.phone_number,
                   dg.interest_rate, dg.group_description
            FROM accounts a
            JOIN customers c ON a.customer_id = c.customer_id
            LEFT JOIN disclosure_groups dg ON a.group_id = dg.group_id
            WHERE 1=1
        `;
        const params = [];
        let paramIndex = 1;

        if (filters.accountId) {
            query += ` AND a.account_id = $${paramIndex}`;
            params.push(filters.accountId);
            paramIndex++;
        }

        if (filters.customerId) {
            query += ` AND a.customer_id = $${paramIndex}`;
            params.push(filters.customerId);
            paramIndex++;
        }

        if (filters.accountStatus) {
            query += ` AND a.account_status = $${paramIndex}`;
            params.push(filters.accountStatus);
            paramIndex++;
        }

        query += ` ORDER BY a.account_id LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        const result = await db.query(query, params);

        let countQuery = 'SELECT COUNT(*) FROM accounts a WHERE 1=1';
        const countParams = [];
        let countParamIndex = 1;

        if (filters.accountId) {
            countQuery += ` AND a.account_id = $${countParamIndex}`;
            countParams.push(filters.accountId);
            countParamIndex++;
        }

        if (filters.customerId) {
            countQuery += ` AND a.customer_id = $${countParamIndex}`;
            countParams.push(filters.customerId);
            countParamIndex++;
        }

        if (filters.accountStatus) {
            countQuery += ` AND a.account_status = $${countParamIndex}`;
            countParams.push(filters.accountStatus);
            countParamIndex++;
        }

        const countResult = await db.query(countQuery, countParams);

        return {
            accounts: result.rows,
            total: parseInt(countResult.rows[0].count),
            page: parseInt(page),
            limit: parseInt(limit)
        };
    }

    async getAccountById(accountId) {
        const result = await db.query(
            `SELECT a.*, c.first_name, c.last_name, c.email, c.phone_number,
                    c.date_of_birth, c.address_line1, c.address_line2, c.city,
                    c.state, c.zip_code, c.fico_credit_score,
                    dg.interest_rate, dg.group_description
             FROM accounts a
             JOIN customers c ON a.customer_id = c.customer_id
             LEFT JOIN disclosure_groups dg ON a.group_id = dg.group_id
             WHERE a.account_id = $1`,
            [accountId]
        );

        return result.rows[0] || null;
    }

    async updateAccount(accountId, updateData) {
        const fields = [];
        const values = [];
        let paramIndex = 1;

        const allowedFields = [
            'account_status', 'credit_limit', 'cash_credit_limit',
            'current_balance', 'current_cycle_credit', 'current_cycle_debit',
            'group_id', 'account_expiry_date'
        ];

        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                fields.push(`${field} = $${paramIndex}`);
                values.push(updateData[field]);
                paramIndex++;
            }
        }

        if (fields.length === 0) {
            throw new Error('No valid fields to update');
        }

        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(accountId);

        const query = `
            UPDATE accounts
            SET ${fields.join(', ')}
            WHERE account_id = $${paramIndex}
            RETURNING *
        `;

        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            throw new Error('Account not found');
        }

        return result.rows[0];
    }

    async calculateAvailableCredit(accountId) {
        const account = await this.getAccountById(accountId);
        if (!account) {
            throw new Error('Account not found');
        }

        return {
            creditLimit: account.credit_limit,
            currentBalance: account.current_balance,
            availableCredit: account.credit_limit - account.current_balance,
            utilizationPercent: ((account.current_balance / account.credit_limit) * 100).toFixed(2)
        };
    }
}

module.exports = new AccountService();
