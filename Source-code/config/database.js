const { Pool } = require('pg');
const winston = require('winston');

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/database.log' })
    ]
});

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'carddemo',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    min: parseInt(process.env.DB_POOL_MIN) || 2,
    max: parseInt(process.env.DB_POOL_MAX) || 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
    logger.info('Database connection established');
});

pool.on('error', (err) => {
    logger.error('Unexpected database error', { error: err.message, stack: err.stack });
});

pool.on('remove', () => {
    logger.info('Database connection removed from pool');
});

const query = async (text, params) => {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        logger.debug('Executed query', { text, duration, rows: result.rowCount });
        return result;
    } catch (error) {
        logger.error('Database query error', { 
            text, 
            error: error.message, 
            stack: error.stack 
        });
        throw error;
    }
};

const getClient = async () => {
    try {
        const client = await pool.connect();
        const release = client.release.bind(client);
        
        client.release = () => {
            client.release = release;
            return release();
        };
        
        return client;
    } catch (error) {
        logger.error('Failed to get database client', { error: error.message });
        throw error;
    }
};

const testConnection = async () => {
    try {
        const result = await query('SELECT NOW() as now');
        logger.info('Database connection test successful', { timestamp: result.rows[0].now });
        return true;
    } catch (error) {
        logger.error('Database connection test failed', { error: error.message });
        return false;
    }
};

module.exports = {
    query,
    getClient,
    testConnection,
    pool
};
