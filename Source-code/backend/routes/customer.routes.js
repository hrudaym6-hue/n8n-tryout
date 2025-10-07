const express = require('express');
const router = express.Router();
const customerService = require('../services/customer.service');
const { authenticateToken } = require('../middleware/auth');
const { validate, validateQuery } = require('../middleware/validation');
const { customerSchema, updateCustomerSchema } = require('../validators/customer.validator');
const { asyncHandler } = require('../middleware/errorHandler');
const Joi = require('joi');

router.use(authenticateToken);

const querySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    customerId: Joi.number().integer().optional()
});

router.get('/', 
    validateQuery(querySchema),
    asyncHandler(async (req, res) => {
        const { page, limit, customerId } = req.query;
        const result = await customerService.getAllCustomers(page, limit, customerId);
        res.json(result);
    })
);

router.get('/:customerId',
    asyncHandler(async (req, res) => {
        const { customerId } = req.params;
        const customer = await customerService.getCustomerById(customerId);
        res.json(customer);
    })
);

router.post('/',
    validate(customerSchema),
    asyncHandler(async (req, res) => {
        const customer = await customerService.createCustomer(req.body);
        res.status(201).json(customer);
    })
);

router.put('/:customerId',
    validate(updateCustomerSchema),
    asyncHandler(async (req, res) => {
        const { customerId } = req.params;
        const customer = await customerService.updateCustomer(customerId, req.body);
        res.json(customer);
    })
);

router.delete('/:customerId',
    asyncHandler(async (req, res) => {
        const { customerId } = req.params;
        const result = await customerService.deleteCustomer(customerId);
        res.json(result);
    })
);

module.exports = router;
