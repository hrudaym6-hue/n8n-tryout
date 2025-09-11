require('dotenv').config();
const express = require('express');
const app = express();

const customerRoutes = require('./routes/CustomerRoutes');
const errorHandler = require('./middlewares/errorHandler');

app.use(express.json());
app.use('/api/customers', customerRoutes);

app.use(errorHandler);

module.exports = app;
