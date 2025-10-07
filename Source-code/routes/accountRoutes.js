const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { validateAccount, validateAccountUpdate } = require('../validators/accountValidator');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/:accountId', accountController.getAccount);

router.get('/customer/:customerId', accountController.getAccountsByCustomer);

router.get('/:accountId/available-credit', accountController.getAvailableCredit);

router.post('/', validateAccount, accountController.createAccount);

router.put('/:accountId', validateAccountUpdate, accountController.updateAccount);

module.exports = router;
