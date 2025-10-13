const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { authenticateToken } = require('../middleware/auth');
const { validateAccountId, validateAccountStatus } = require('../middleware/validation');

router.use(authenticateToken);

router.get('/', accountController.getAccounts);

router.get('/:id', validateAccountId, accountController.getAccountById);

router.put('/:id', 
    validateAccountId,
    validateAccountStatus,
    accountController.updateAccount
);

router.get('/:id/credit', validateAccountId, accountController.getAvailableCredit);

module.exports = router;
