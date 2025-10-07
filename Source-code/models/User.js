const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    static async findById(userId) {
        const result = await db.query(
            'SELECT * FROM users WHERE user_id = $1',
            [userId]
        );
        return result.rows[0];
    }

    static async findAll(options = {}) {
        const { page = 1, limit = 10 } = options;
        const offset = (page - 1) * limit;

        const result = await db.query(
            'SELECT user_id, first_name, last_name, user_type, created_at, updated_at FROM users ORDER BY user_id LIMIT $1 OFFSET $2',
            [limit, offset]
        );

        const countResult = await db.query('SELECT COUNT(*) FROM users');

        return {
            users: result.rows,
            total: parseInt(countResult.rows[0].count),
            page,
            limit
        };
    }

    static async create(userData) {
        const { userId, firstName, lastName, password, userType } = userData;

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.query(
            `INSERT INTO users (user_id, first_name, last_name, password, user_type)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING user_id, first_name, last_name, user_type, created_at`,
            [userId, firstName, lastName, hashedPassword, userType]
        );
        return result.rows[0];
    }

    static async update(userId, updates) {
        const fields = [];
        const values = [];
        let paramCount = 1;

        const allowedFields = ['firstName', 'lastName', 'password', 'userType'];
        
        for (const key of allowedFields) {
            if (updates[key] !== undefined) {
                if (key === 'password') {
                    const hashedPassword = await bcrypt.hash(updates[key], 10);
                    fields.push(`password = $${paramCount}`);
                    values.push(hashedPassword);
                } else {
                    fields.push(`${this._toSnakeCase(key)} = $${paramCount}`);
                    values.push(updates[key]);
                }
                paramCount++;
            }
        }

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(userId);

        const query = `
            UPDATE users 
            SET ${fields.join(', ')}
            WHERE user_id = $${paramCount}
            RETURNING user_id, first_name, last_name, user_type, updated_at
        `;

        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async delete(userId) {
        const result = await db.query(
            'DELETE FROM users WHERE user_id = $1 RETURNING user_id, first_name, last_name, user_type',
            [userId]
        );
        return result.rows[0];
    }

    static async authenticate(userId, password) {
        const user = await this.findById(userId);
        if (!user) {
            return null;
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return null;
        }

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    static _toSnakeCase(str) {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }
}

module.exports = User;
