const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next(new AppError('Access token required', 401));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(new AppError('Invalid or expired token', 403));
        }
        req.user = decoded;
        next();
    });
};

const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.userType !== 'A') {
        return next(new AppError('Admin access required', 403));
    }
    next();
};

const requireUser = (req, res, next) => {
    if (!req.user || (req.user.userType !== 'U' && req.user.userType !== 'A')) {
        return next(new AppError('User access required', 403));
    }
    next();
};

module.exports = {
    authenticateToken,
    requireAdmin,
    requireUser
};
