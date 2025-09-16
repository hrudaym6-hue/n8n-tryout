require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models/index');
const userRoutes = require('./routes/userRoutes');
const accountRoutes = require('./routes/accountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => res.send('API is running'));

sequelize.sync().then(() => {
  console.log('Database synced.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log());
