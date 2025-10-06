const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT user_id, first_name, last_name, user_type, created_at FROM users ORDER BY user_id'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { userId, firstName, lastName, password, userType } = req.body;

        if (!userId || !firstName || !lastName || !password || !userType) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (userType !== 'U' && userType !== 'A') {
            return res.status(400).json({ error: 'User type must be U or A' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.query(
            'INSERT INTO users (user_id, first_name, last_name, password, user_type) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, first_name, last_name, user_type',
            [userId, firstName, lastName, hashedPassword, userType]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ error: 'User ID already exists' });
        }
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

router.put('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { firstName, lastName, password, userType } = req.body;

        let query = 'UPDATE users SET updated_at = CURRENT_TIMESTAMP';
        const params = [];
        let paramCount = 1;

        if (firstName) {
            query += `, first_name = $${paramCount}`;
            params.push(firstName);
            paramCount++;
        }
        if (lastName) {
            query += `, last_name = $${paramCount}`;
            params.push(lastName);
            paramCount++;
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += `, password = $${paramCount}`;
            params.push(hashedPassword);
            paramCount++;
        }
        if (userType) {
            if (userType !== 'U' && userType !== 'A') {
                return res.status(400).json({ error: 'User type must be U or A' });
            }
            query += `, user_type = $${paramCount}`;
            params.push(userType);
            paramCount++;
        }

        query += ` WHERE user_id = $${paramCount} RETURNING user_id, first_name, last_name, user_type`;
        params.push(userId);

        const result = await db.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

router.delete('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await db.query('DELETE FROM users WHERE user_id = $1 RETURNING user_id', [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;
