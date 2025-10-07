const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { validateCustomer, validateCustomerUpdate } = require('../validators/customerValidator');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', customerController.getAllCustomers);

router.get('/:customerId', customerController.getCustomer);

router.post('/', validateCustomer, customerController.createCustomer);

router.put('/:customerId', validateCustomerUpdate, customerController.updateCustomer);

router.delete('/:customerId', customerController.deleteCustomer);

module.exports = router;
