require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createTables } = require('./models');
const userRoutes = require('./routes/userRoutes');
const accountRoutes = require('./routes/accountRoutes');
const orderRoutes = require('./routes/orderRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const app = express();

app.use(cors());
app.use(express.json());

// Route setup
app.use('/api/users', userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/transactions', transactionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});

// Initialize tables and start server
const PORT = process.env.PORT || 3000;

createTables()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to start server:', err);
  });

module.exports = app;
