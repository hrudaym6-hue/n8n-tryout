const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

exports.login = async (req, res, next) => {
    try {
        const { userId, password } = req.body;

        if (!userId || !password) {
            return res.status(400).json({ error: 'User ID and password are required' });
        }

        const result = await db.query(
            'SELECT * FROM users WHERE user_id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid user ID or password' });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid user ID or password' });
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

        res.json({
            token,
            user: {
                userId: user.user_id,
                firstName: user.first_name,
                lastName: user.last_name,
                userType: user.user_type
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.verifyToken = async (req, res) => {
    res.json({
        valid: true,
        user: req.user
    });
};
