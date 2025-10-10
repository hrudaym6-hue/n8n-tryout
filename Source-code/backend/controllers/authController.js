const bcrypt = require('bcrypt');
const { users } = require('../database/memoryStore');

exports.register = async (req, res, next) => {
    try {
        const { userId, firstName, lastName, password, userType = 'U' } = req.body;

        if (!userId || !firstName || !lastName || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (users.has(userId)) {
            return res.status(400).json({ error: 'User ID already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = {
            user_id: userId,
            first_name: firstName,
            last_name: lastName,
            password: hashedPassword,
            user_type: userType,
            created_at: new Date(),
            updated_at: new Date()
        };

        users.set(userId, newUser);

        console.log('[REGISTER] User registered:', userId);
        console.log('[REGISTER] Total users:', users.size);
        console.log('[REGISTER] All user IDs:', Array.from(users.keys()));

        req.session.user = {
            userId: newUser.user_id,
            userType: newUser.user_type,
            firstName: newUser.first_name,
            lastName: newUser.last_name
        };

        res.status(201).json({
            message: 'User registered successfully',
            user: req.session.user
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { userId, password } = req.body;

        console.log('[LOGIN] Attempt for userId:', userId);
        console.log('[LOGIN] Total users in Map:', users.size);
        console.log('[LOGIN] All user IDs:', Array.from(users.keys()));

        if (!userId || !password) {
            return res.status(400).json({ error: 'User ID and password are required' });
        }

        const user = users.get(userId);

        console.log('[LOGIN] User found:', user ? 'YES' : 'NO');
        if (user) {
            console.log('[LOGIN] User object:', { ...user, password: '[REDACTED]' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid user ID or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        console.log('[LOGIN] Password valid:', validPassword);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid user ID or password' });
        }

        req.session.user = {
            userId: user.user_id,
            userType: user.user_type,
            firstName: user.first_name,
            lastName: user.last_name
        };

        res.json({
            user: req.session.user
        });
    } catch (error) {
        next(error);
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to logout' });
        }
        res.json({ message: 'Logged out successfully' });
    });
};

exports.verifySession = (req, res) => {
    if (req.session.user) {
        res.json({
            valid: true,
            user: req.session.user
        });
    } else {
        res.status(401).json({ valid: false });
    }
};
