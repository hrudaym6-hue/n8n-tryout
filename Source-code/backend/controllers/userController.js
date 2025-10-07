const userService = require('../services/userService');

exports.getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await userService.getAllUsers(parseInt(page), parseInt(limit));
        res.json(result);
    } catch (error) {
        next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await userService.getUserById(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        next(error);
    }
};

exports.createUser = async (req, res, next) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await userService.updateUser(userId, req.body);
        res.json(user);
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const result = await userService.deleteUser(userId);
        res.json(result);
    } catch (error) {
        next(error);
    }
};
