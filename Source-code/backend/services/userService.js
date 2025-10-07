const db = require('../config/database');
const bcrypt = require('bcrypt');

class UserService {
    async getAllUsers(page = 1, limit = 10) {
        const offset = (page - 1) * limit;

        const result = await db.query(
            `SELECT user_id, first_name, last_name, user_type, created_at, updated_at
             FROM users
             ORDER BY user_id
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        const countResult = await db.query('SELECT COUNT(*) FROM users');

        return {
            users: result.rows,
            total: parseInt(countResult.rows[0].count),
            page: parseInt(page),
            limit: parseInt(limit)
        };
    }

    async getUserById(userId) {
        const result = await db.query(
            `SELECT user_id, first_name, last_name, user_type, created_at, updated_at
             FROM users
             WHERE user_id = $1`,
            [userId]
        );

        return result.rows[0] || null;
    }

    async createUser(userData) {
        const { userId, firstName, lastName, password, userType } = userData;

        const existingUser = await this.getUserById(userId);
        if (existingUser) {
            throw new Error('User ID already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.query(
            `INSERT INTO users (user_id, first_name, last_name, password, user_type)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING user_id, first_name, last_name, user_type, created_at, updated_at`,
            [userId, firstName, lastName, hashedPassword, userType]
        );

        return result.rows[0];
    }

    async updateUser(userId, updateData) {
        const fields = [];
        const values = [];
        let paramIndex = 1;

        if (updateData.firstName) {
            fields.push(`first_name = $${paramIndex}`);
            values.push(updateData.firstName);
            paramIndex++;
        }

        if (updateData.lastName) {
            fields.push(`last_name = $${paramIndex}`);
            values.push(updateData.lastName);
            paramIndex++;
        }

        if (updateData.password) {
            const hashedPassword = await bcrypt.hash(updateData.password, 10);
            fields.push(`password = $${paramIndex}`);
            values.push(hashedPassword);
            paramIndex++;
        }

        if (updateData.userType) {
            fields.push(`user_type = $${paramIndex}`);
            values.push(updateData.userType);
            paramIndex++;
        }

        if (fields.length === 0) {
            throw new Error('No valid fields to update');
        }

        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(userId);

        const query = `
            UPDATE users
            SET ${fields.join(', ')}
            WHERE user_id = $${paramIndex}
            RETURNING user_id, first_name, last_name, user_type, created_at, updated_at
        `;

        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            throw new Error('User not found');
        }

        return result.rows[0];
    }

    async deleteUser(userId) {
        const result = await db.query(
            'DELETE FROM users WHERE user_id = $1 RETURNING user_id',
            [userId]
        );

        if (result.rows.length === 0) {
            throw new Error('User not found');
        }

        return { success: true, userId: result.rows[0].user_id };
    }
}

module.exports = new UserService();
