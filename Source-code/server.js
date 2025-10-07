require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const logger = require('./config/logger');
const db = require('./config/database');
const requestLogger = require('./middleware/requestLogger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const authorizationRoutes = require('./routes/authorizationRoutes');
const accountRoutes = require('./routes/accountRoutes');
const cardRoutes = require('./routes/cardRoutes');
const customerRoutes = require('./routes/customerRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: 'Too many requests from this IP, please try again later'
});

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use('/api/', limiter);

app.get('/health', async (req, res) => {
    try {
        const dbHealthy = await db.testConnection();
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            database: dbHealthy ? 'connected' : 'disconnected',
            uptime: process.uptime(),
            memory: process.memoryUsage()
        });
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
});

app.get('/api', (req, res) => {
    res.json({
        name: 'CardDemo Authorization API',
        version: '1.0.0',
        description: 'Full-stack backend for credit card authorization system',
        endpoints: {
            auth: '/api/auth',
            authorizations: '/api/authorizations',
            accounts: '/api/accounts',
            cards: '/api/cards',
            customers: '/api/customers',
            transactions: '/api/transactions',
            users: '/api/users'
        }
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/authorizations', authorizationRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
    try {
        const dbHealthy = await db.testConnection();
        if (!dbHealthy) {
            logger.error('Failed to connect to database');
            process.exit(1);
        }

        app.listen(PORT, () => {
            logger.info(`CardDemo Backend Server running on port ${PORT}`);
            logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
            logger.info(`Health check: http://localhost:${PORT}/health`);
            logger.info(`API documentation: http://localhost:${PORT}/api`);
        });
    } catch (error) {
        logger.error('Failed to start server', { error: error.message, stack: error.stack });
        process.exit(1);
    }
};

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', { reason, promise });
});

process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    process.exit(0);
});

if (require.main === module) {
    startServer();
}

module.exports = app;
