const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { authenticateSession, requireAdmin } = require('../middleware/auth');
const { validateRequired, validateAccountId, validateAccountStatus } = require('../middleware/validation');

router.get('/', authenticateSession, accountController.getAccounts);

router.get('/:id', authenticateSession, validateAccountId, accountController.getAccountById);

router.post('/', 
    authenticateSession,
    requireAdmin,
    validateRequired(['customerId', 'creditLimit']),
    accountController.createAccount
);

router.put('/:id', 
    authenticateSession,
    requireAdmin,
    validateAccountId,
    validateAccountStatus,
    accountController.updateAccount
);

router.get('/:id/available-credit', authenticateSession, validateAccountId, accountController.getAvailableCredit);

router.get('/:id/monthly-interest', authenticateSession, validateAccountId, accountController.getMonthlyInterest);

module.exports = router;
