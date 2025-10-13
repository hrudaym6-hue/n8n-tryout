const express = require('express');
const router = express.Router();
const authorizationController = require('../controllers/authorizationController');
const { authenticateSession, requireAdmin } = require('../middleware/auth');
const { validateRequired, validateCardNumber, validateTransactionAmount } = require('../middleware/validation');

router.get('/', authenticateSession, authorizationController.getAuthorizations);

router.get('/:id', authenticateSession, authorizationController.getAuthorizationById);

router.post('/', 
    authenticateSession,
    validateRequired(['cardNumber', 'transactionAmount', 'merchantId', 'merchantName']),
    validateCardNumber,
    validateTransactionAmount,
    authorizationController.createAuthorization
);

router.post('/purge', 
    authenticateSession,
    requireAdmin,
    authorizationController.purgeExpiredAuthorizations
);

module.exports = router;
