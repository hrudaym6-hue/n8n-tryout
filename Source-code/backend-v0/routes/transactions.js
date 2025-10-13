const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/auth');
const {
    validateRequired,
    validateAccountId,
    validateCardNumber,
    validateTransactionAmount,
    validateTransactionId,
    validateMerchantId
} = require('../middleware/validation');

router.use(authenticateToken);

router.get('/', transactionController.getTransactions);

router.get('/:id', validateTransactionId, transactionController.getTransactionById);

router.post('/',
    validateRequired(['accountId', 'cardNumber', 'transactionTypeCode', 'transactionCategoryCode', 'transactionAmount']),
    validateAccountId,
    validateCardNumber,
    validateTransactionAmount,
    validateMerchantId,
    transactionController.createTransaction
);

module.exports = router;
