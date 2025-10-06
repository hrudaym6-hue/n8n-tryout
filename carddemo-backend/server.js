const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/cards', require('./routes/cards'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/transaction-types', require('./routes/transactionTypes'));
app.use('/api/authorizations', require('./routes/authorizations'));
app.use('/api/users', require('./routes/users'));
app.use('/api/customers', require('./routes/customers'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`CardDemo Backend Server running on port ${PORT}`);
});

module.exports = app;
