const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
    logger.error('Error occurred', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        body: req.body
    });

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation error',
            details: err.details
        });
    }

    if (err.code === '23505') {
        return res.status(409).json({
            error: 'Duplicate entry',
            message: 'A record with this identifier already exists'
        });
    }

    if (err.code === '23503') {
        return res.status(400).json({
            error: 'Foreign key violation',
            message: 'Referenced record does not exist'
        });
    }

    if (err.code === '23502') {
        return res.status(400).json({
            error: 'Missing required field',
            message: err.message
        });
    }

    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

const notFoundHandler = (req, res) => {
    logger.warn('Route not found', { url: req.url, method: req.method });
    res.status(404).json({
        error: 'Not found',
        message: `Route ${req.method} ${req.url} not found`
    });
};

module.exports = {
    errorHandler,
    notFoundHandler
};
