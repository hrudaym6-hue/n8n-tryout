const db = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

class AccountService {
    async getAllAccounts(page = 1, limit = 10, accountId = null) {
        const offset = (page - 1) * limit;
        let query = `
            SELECT a.*, c.first_name, c.last_name, c.email, c.phone_number
            FROM accounts a
            JOIN customers c ON a.customer_id = c.customer_id
        `;
        let countQuery = 'SELECT COUNT(*) FROM accounts';
        let params = [];
        
        if (accountId) {
            query += ' WHERE a.account_id = $1';
            countQuery += ' WHERE account_id = $1';
            params.push(accountId);
        }
        
        query += ' ORDER BY a.account_id LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
        params.push(limit, offset);
        
        const [accountsResult, countResult] = await Promise.all([
            db.query(query, params),
            db.query(countQuery, accountId ? [accountId] : [])
        ]);

        return {
            accounts: accountsResult.rows,
            total: parseInt(countResult.rows[0].count),
            page: parseInt(page),
            limit: parseInt(limit)
        };
    }

    async getAccountById(accountId) {
        const result = await db.query(
            `SELECT a.*, c.first_name, c.last_name, c.email, c.phone_number
             FROM accounts a
             JOIN customers c ON a.customer_id = c.customer_id
             WHERE a.account_id = $1`,
            [accountId]
        );

        if (result.rows.length === 0) {
            throw new AppError('Did not find this account in account master file', 404);
        }

        return result.rows[0];
    }

    async createAccount(accountData) {
        const { customerId, accountStatus, accountOpenDate, accountExpiryDate, 
                creditLimit, cashCreditLimit, groupId } = accountData;

        const customerExists = await db.query(
            'SELECT customer_id FROM customers WHERE customer_id = $1',
            [customerId]
        );

        if (customerExists.rows.length === 0) {
            throw new AppError('Did not find associated customer in master file', 404);
        }

        const result = await db.query(
            `INSERT INTO accounts (
                customer_id, account_status, account_open_date, account_expiry_date,
                credit_limit, cash_credit_limit, group_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [customerId, accountStatus, accountOpenDate, accountExpiryDate, 
             creditLimit, cashCreditLimit, groupId]
        );

        return result.rows[0];
    }

    async updateAccount(accountId, accountData) {
        const existingAccount = await db.query(
            'SELECT * FROM accounts WHERE account_id = $1',
            [accountId]
        );

        if (existingAccount.rows.length === 0) {
            throw new AppError('Did not find this account in account master file', 404);
        }

        const updates = [];
        const values = [];
        let paramCount = 1;

        const fields = {
            accountStatus: 'account_status',
            accountExpiryDate: 'account_expiry_date',
            creditLimit: 'credit_limit',
            cashCreditLimit: 'cash_credit_limit',
            groupId: 'group_id'
        };

        for (const [key, dbField] of Object.entries(fields)) {
            if (accountData[key] !== undefined) {
                updates.push(`${dbField} = $${paramCount++}`);
                values.push(accountData[key]);
            }
        }

        if (updates.length === 0) {
            throw new AppError('No fields to update', 400);
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(accountId);

        const result = await db.query(
            `UPDATE accounts SET ${updates.join(', ')} WHERE account_id = $${paramCount}
             RETURNING *`,
            values
        );

        return result.rows[0];
    }

    async updateAccountBalance(accountId, amount, type = 'debit') {
        const account = await this.getAccountById(accountId);
        
        const newBalance = type === 'debit' 
            ? parseFloat(account.current_balance) + parseFloat(amount)
            : parseFloat(account.current_balance) - parseFloat(amount);

        const result = await db.query(
            `UPDATE accounts 
             SET current_balance = $1, updated_at = CURRENT_TIMESTAMP
             WHERE account_id = $2
             RETURNING *`,
            [newBalance, accountId]
        );

        return result.rows[0];
    }

    async deleteAccount(accountId) {
        const result = await db.query(
            'DELETE FROM accounts WHERE account_id = $1 RETURNING account_id',
            [accountId]
        );

        if (result.rows.length === 0) {
            throw new AppError('Did not find this account in account master file', 404);
        }

        return { message: 'Account deleted successfully' };
    }
}

module.exports = new AccountService();
