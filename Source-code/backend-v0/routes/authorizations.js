const express = require('express');
const router = express.Router();
const authorizationController = require('../controllers/authorizationController');
const { authenticateToken } = require('../middleware/auth');
const {
    validateRequired,
    validateAccountId,
    validateCardNumber,
    validateTransactionAmount,
    validateMerchantId
} = require('../middleware/validation');

router.use(authenticateToken);

router.post('/',
    validateRequired(['accountId', 'cardNumber', 'transactionAmount']),
    validateAccountId,
    validateCardNumber,
    validateTransactionAmount,
    validateMerchantId,
    authorizationController.processAuthorization
);

router.get('/account/:accountId',
    validateAccountId,
    authorizationController.getAuthorizationsByAccount
);

router.get('/:id', authorizationController.getAuthorizationById);

module.exports = router;
