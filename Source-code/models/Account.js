const db = require('../config/database');

class Account {
    static async findById(accountId) {
        const result = await db.query(
            'SELECT * FROM accounts WHERE account_id = $1',
            [accountId]
        );
        return result.rows[0];
    }

    static async findByCustomerId(customerId) {
        const result = await db.query(
            'SELECT * FROM accounts WHERE customer_id = $1 ORDER BY account_id',
            [customerId]
        );
        return result.rows;
    }

    static async create(accountData) {
        const {
            accountId, customerId, accountStatus, accountOpenDate,
            accountExpiryDate, currentBalance, creditLimit, cashCreditLimit,
            currentCycleCredit, currentCycleDebit, groupId
        } = accountData;

        const result = await db.query(
            `INSERT INTO accounts (
                account_id, customer_id, account_status, account_open_date,
                account_expiry_date, current_balance, credit_limit, cash_credit_limit,
                current_cycle_credit, current_cycle_debit, group_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *`,
            [accountId, customerId, accountStatus, accountOpenDate, accountExpiryDate,
             currentBalance || 0, creditLimit, cashCreditLimit, 
             currentCycleCredit || 0, currentCycleDebit || 0, groupId]
        );
        return result.rows[0];
    }

    static async update(accountId, updates) {
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
        values.push(accountId);

        const query = `
            UPDATE accounts 
            SET ${fields.join(', ')}
            WHERE account_id = $${paramCount}
            RETURNING *
        `;

        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async updateBalance(accountId, amount, isCredit = true) {
        const operator = isCredit ? '+' : '-';
        const result = await db.query(
            `UPDATE accounts 
             SET current_balance = current_balance ${operator} $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE account_id = $2
             RETURNING *`,
            [amount, accountId]
        );
        return result.rows[0];
    }

    static async getAvailableCredit(accountId) {
        const account = await this.findById(accountId);
        if (!account) {
            return null;
        }
        return account.credit_limit - account.current_balance;
    }

    static _toSnakeCase(str) {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }
}

module.exports = Account;
