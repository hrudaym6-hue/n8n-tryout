const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

const initDatabase = async () => {
    try {
        console.log('Initializing database schema...');
        
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        await pool.query(schema);
        
        console.log('Database schema initialized successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
};

initDatabase();
