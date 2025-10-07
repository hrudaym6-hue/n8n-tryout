const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            details: err.message
        });
    }

    if (err.code === '23505') {
        return res.status(409).json({
            error: 'Duplicate entry',
            details: 'A record with this key already exists'
        });
    }

    if (err.code === '23503') {
        return res.status(400).json({
            error: 'Foreign key violation',
            details: 'Referenced record does not exist'
        });
    }

    if (err.code === '23502') {
        return res.status(400).json({
            error: 'Missing required field',
            details: err.message
        });
    }

    if (err.code === '23514') {
        return res.status(400).json({
            error: 'Check constraint violation',
            details: err.message
        });
    }

    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
