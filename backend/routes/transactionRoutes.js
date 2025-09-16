const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { validateTransaction } = require('../middlewares/validate');

router.post('/', validateTransaction, transactionController.createTransaction);
router.get('/', transactionController.getTransactions);
router.get('/:id', transactionController.getTransaction);
router.put('/:id', validateTransaction, transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
