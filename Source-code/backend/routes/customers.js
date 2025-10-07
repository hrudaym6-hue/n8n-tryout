const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authenticateToken } = require('../middleware/auth');
const {
    validateRequired,
    validatePhoneNumber,
    validateSSN,
    validateFICO
} = require('../middleware/validation');

router.use(authenticateToken);

router.get('/', customerController.getAllCustomers);

router.get('/:id', customerController.getCustomerById);

router.post('/',
    validateRequired(['customerId', 'firstName', 'lastName']),
    validatePhoneNumber,
    validateSSN,
    validateFICO,
    customerController.createCustomer
);

router.put('/:id',
    validatePhoneNumber,
    validateSSN,
    validateFICO,
    customerController.updateCustomer
);

module.exports = router;
