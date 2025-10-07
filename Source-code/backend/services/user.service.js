const bcrypt = require('bcrypt');
const db = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

class UserService {
    async getAllUsers(page = 1, limit = 10, userId = null) {
        const offset = (page - 1) * limit;
        let query = 'SELECT user_id, first_name, last_name, user_type, created_at, updated_at FROM users';
        let countQuery = 'SELECT COUNT(*) FROM users';
        let params = [];
        
        if (userId) {
            query += ' WHERE user_id = $1';
            countQuery += ' WHERE user_id = $1';
            params.push(userId);
        }
        
        query += ' ORDER BY user_id LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
        params.push(limit, offset);
        
        const [usersResult, countResult] = await Promise.all([
            db.query(query, params),
            db.query(countQuery, userId ? [userId] : [])
        ]);

        return {
            users: usersResult.rows,
            total: parseInt(countResult.rows[0].count),
            page: parseInt(page),
            limit: parseInt(limit)
        };
    }

    async getUserById(userId) {
        const result = await db.query(
            'SELECT user_id, first_name, last_name, user_type, created_at, updated_at FROM users WHERE user_id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            throw new AppError('User ID not found', 404);
        }

        return result.rows[0];
    }

    async createUser(userData) {
        const { userId, firstName, lastName, password, userType } = userData;

        const existingUser = await db.query(
            'SELECT user_id FROM users WHERE user_id = $1',
            [userId]
        );

        if (existingUser.rows.length > 0) {
            throw new AppError('User ID already exist...', 409);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.query(
            `INSERT INTO users (user_id, first_name, last_name, password, user_type)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING user_id, first_name, last_name, user_type, created_at`,
            [userId, firstName, lastName, hashedPassword, userType]
        );

        return result.rows[0];
    }

    async updateUser(userId, userData) {
        const existingUser = await db.query(
            'SELECT * FROM users WHERE user_id = $1',
            [userId]
        );

        if (existingUser.rows.length === 0) {
            throw new AppError('User ID not found', 404);
        }

        const oldUser = existingUser.rows[0];
        const { firstName, lastName, password, userType } = userData;

        let hasChanges = false;
        if (firstName && firstName !== oldUser.first_name) hasChanges = true;
        if (lastName && lastName !== oldUser.last_name) hasChanges = true;
        if (userType && userType !== oldUser.user_type) hasChanges = true;
        if (password) hasChanges = true;

        if (!hasChanges) {
            throw new AppError('Please modify to update ...', 400);
        }

        const updates = [];
        const values = [];
        let paramCount = 1;

        if (firstName) {
            updates.push(`first_name = $${paramCount++}`);
            values.push(firstName);
        }
        if (lastName) {
            updates.push(`last_name = $${paramCount++}`);
            values.push(lastName);
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push(`password = $${paramCount++}`);
            values.push(hashedPassword);
        }
        if (userType) {
            updates.push(`user_type = $${paramCount++}`);
            values.push(userType);
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(userId);

        const result = await db.query(
            `UPDATE users SET ${updates.join(', ')} WHERE user_id = $${paramCount}
             RETURNING user_id, first_name, last_name, user_type, updated_at`,
            values
        );

        return result.rows[0];
    }

    async deleteUser(userId) {
        const result = await db.query(
            'DELETE FROM users WHERE user_id = $1 RETURNING user_id',
            [userId]
        );

        if (result.rows.length === 0) {
            throw new AppError('User ID not found', 404);
        }

        return { message: 'User deleted successfully' };
    }
}

module.exports = new UserService();
