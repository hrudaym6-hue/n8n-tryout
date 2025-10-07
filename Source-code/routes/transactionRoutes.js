const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { validateTransaction } = require('../validators/transactionValidator');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/:transactionId', transactionController.getTransaction);

router.get('/account/:accountId', transactionController.getTransactionsByAccount);

router.post('/', validateTransaction, transactionController.createTransaction);

module.exports = router;
