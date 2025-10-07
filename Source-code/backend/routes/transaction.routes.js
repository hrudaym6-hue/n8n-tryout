const express = require('express');
const router = express.Router();
const transactionService = require('../services/transaction.service');
const { authenticateToken } = require('../middleware/auth');
const { validate, validateQuery } = require('../middleware/validation');
const { transactionSchema } = require('../validators/transaction.validator');
const { asyncHandler } = require('../middleware/errorHandler');
const Joi = require('joi');

router.use(authenticateToken);

const querySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    transactionId: Joi.string().optional(),
    accountId: Joi.number().integer().optional(),
    cardNumber: Joi.string().optional()
});

router.get('/', 
    validateQuery(querySchema),
    asyncHandler(async (req, res) => {
        const { page, limit, ...filters } = req.query;
        const result = await transactionService.getAllTransactions(page, limit, filters);
        res.json(result);
    })
);

router.get('/types',
    asyncHandler(async (req, res) => {
        const types = await transactionService.getTransactionTypes();
        res.json(types);
    })
);

router.get('/categories',
    asyncHandler(async (req, res) => {
        const categories = await transactionService.getTransactionCategories();
        res.json(categories);
    })
);

router.get('/:transactionId',
    asyncHandler(async (req, res) => {
        const { transactionId } = req.params;
        const transaction = await transactionService.getTransactionById(transactionId);
        res.json(transaction);
    })
);

router.post('/',
    validate(transactionSchema),
    asyncHandler(async (req, res) => {
        const transaction = await transactionService.createTransaction(req.body);
        res.status(201).json(transaction);
    })
);

module.exports = router;
