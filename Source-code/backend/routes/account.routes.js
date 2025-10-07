const express = require('express');
const router = express.Router();
const accountService = require('../services/account.service');
const { authenticateToken } = require('../middleware/auth');
const { validate, validateQuery } = require('../middleware/validation');
const { accountSchema, updateAccountSchema } = require('../validators/account.validator');
const { asyncHandler } = require('../middleware/errorHandler');
const Joi = require('joi');

router.use(authenticateToken);

const querySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    accountId: Joi.number().integer().optional()
});

router.get('/', 
    validateQuery(querySchema),
    asyncHandler(async (req, res) => {
        const { page, limit, accountId } = req.query;
        const result = await accountService.getAllAccounts(page, limit, accountId);
        res.json(result);
    })
);

router.get('/:accountId',
    asyncHandler(async (req, res) => {
        const { accountId } = req.params;
        const account = await accountService.getAccountById(accountId);
        res.json(account);
    })
);

router.post('/',
    validate(accountSchema),
    asyncHandler(async (req, res) => {
        const account = await accountService.createAccount(req.body);
        res.status(201).json(account);
    })
);

router.put('/:accountId',
    validate(updateAccountSchema),
    asyncHandler(async (req, res) => {
        const { accountId } = req.params;
        const account = await accountService.updateAccount(accountId, req.body);
        res.json(account);
    })
);

router.delete('/:accountId',
    asyncHandler(async (req, res) => {
        const { accountId } = req.params;
        const result = await accountService.deleteAccount(accountId);
        res.json(result);
    })
);

module.exports = router;
