const router = require('express').Router();
const controller = require('../controllers/transactionController');
const validate = require('../validation/validate');
const { createTransaction } = require('../validation/transactionValidation');
router.post('/', validate(createTransaction), controller.create);
module.exports = router;
