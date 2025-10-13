const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticateSession, requireAdmin } = require('../middleware/auth');
const { 
    validateRequired, 
    validateTransactionId, 
    validateTransactionAmount,
    validateMerchantId,
    validateCardNumber 
} = require('../middleware/validation');

router.get('/', authenticateSession, transactionController.getTransactions);

router.get('/:id', authenticateSession, validateTransactionId, transactionController.getTransactionById);

router.post('/', 
    authenticateSession,
    requireAdmin,
    validateRequired([
        'accountId', 'cardNumber', 'transactionTypeCode', 'transactionCategoryCode',
        'transactionSource', 'transactionDescription', 'transactionAmount',
        'merchantId', 'merchantName'
    ]),
    validateCardNumber,
    validateTransactionAmount,
    validateMerchantId,
    transactionController.createTransaction
);

module.exports = router;
