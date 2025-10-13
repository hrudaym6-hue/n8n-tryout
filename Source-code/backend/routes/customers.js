const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authenticateSession, requireAdmin } = require('../middleware/auth');
const { 
    validateRequired, 
    validatePhoneNumber, 
    validateSSN, 
    validateFICO 
} = require('../middleware/validation');

router.get('/', authenticateSession, customerController.getCustomers);

router.get('/:id', authenticateSession, customerController.getCustomerById);

router.post('/', 
    authenticateSession,
    requireAdmin,
    validateRequired([
        'firstName', 'lastName', 'dateOfBirth', 'ssn', 
        'email', 'phoneNumber', 'addressLine1', 'city', 'state', 'zipCode'
    ]),
    validatePhoneNumber,
    validateSSN,
    validateFICO,
    customerController.createCustomer
);

router.put('/:id', 
    authenticateSession,
    requireAdmin,
    validatePhoneNumber,
    validateFICO,
    customerController.updateCustomer
);

module.exports = router;
