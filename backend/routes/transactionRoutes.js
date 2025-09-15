const express = require('express');
const { createTransaction } = require('../controllers/transactionController');
const { validateTransaction } = require('../middleware/validation');
const router = express.Router();
router.post('/', validateTransaction, createTransaction);
module.exports = router;
