const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

class AuthService {
    async login(userId, password) {
        const result = await db.query(
            'SELECT * FROM users WHERE user_id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            throw new AppError('Invalid user ID or password', 401);
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            throw new AppError('Invalid user ID or password', 401);
        }

        const token = jwt.sign(
            {
                userId: user.user_id,
                userType: user.user_type,
                firstName: user.first_name,
                lastName: user.last_name
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION || '24h' }
        );

        return {
            token,
            user: {
                userId: user.user_id,
                firstName: user.first_name,
                lastName: user.last_name,
                userType: user.user_type
            }
        };
    }
}

module.exports = new AuthService();
