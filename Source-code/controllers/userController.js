const User = require('../models/User');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

class UserController {
    async login(req, res) {
        try {
            const { userId, password } = req.validatedData;

            const user = await User.authenticate(userId, password);

            if (!user) {
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
            logger.error('Login error', { error: error.message, stack: error.stack });
            res.status(500).json({ error: 'Login failed', message: error.message });
        }
    }

    async getUser(req, res) {
        try {
            const { userId } = req.params;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const { password, ...userWithoutPassword } = user;
            res.json(userWithoutPassword);
        } catch (error) {
            logger.error('Get user error', { error: error.message });
            res.status(500).json({ error: 'Failed to fetch user', message: error.message });
        }
    }

    async getAllUsers(req, res) {
        try {
            const { page, limit } = req.query;
            const result = await User.findAll({
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10
            });

            res.json(result);
        } catch (error) {
            logger.error('Get all users error', { error: error.message });
            res.status(500).json({ error: 'Failed to fetch users', message: error.message });
        }
    }

    async createUser(req, res) {
        try {
            const userData = req.validatedData;
            const user = await User.create(userData);

            res.status(201).json(user);
        } catch (error) {
            logger.error('Create user error', { error: error.message, stack: error.stack });
            
            if (error.code === '23505') {
                return res.status(409).json({ error: 'User ID already exists' });
            }
            
            res.status(500).json({ error: 'Failed to create user', message: error.message });
        }
    }

    async updateUser(req, res) {
        try {
            const { userId } = req.params;
            const updates = req.validatedData;

            const user = await User.update(userId, updates);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json(user);
        } catch (error) {
            logger.error('Update user error', { error: error.message, stack: error.stack });
            res.status(500).json({ error: 'Failed to update user', message: error.message });
        }
    }

    async deleteUser(req, res) {
        try {
            const { userId } = req.params;
            const user = await User.delete(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ message: 'User deleted successfully', user });
        } catch (error) {
            logger.error('Delete user error', { error: error.message, stack: error.stack });
            res.status(500).json({ error: 'Failed to delete user', message: error.message });
        }
    }
}

module.exports = new UserController();
