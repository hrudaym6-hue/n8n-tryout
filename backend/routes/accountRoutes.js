const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { validateAccount } = require('../middlewares/validate');

router.post('/', validateAccount, accountController.createAccount);
router.get('/', accountController.getAccounts);
router.get('/:id', accountController.getAccount);
router.put('/:id', validateAccount, accountController.updateAccount);
router.delete('/:id', accountController.deleteAccount);

module.exports = router;
