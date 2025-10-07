const express = require('express');
const router = express.Router();
const authorizationService = require('../services/authorization.service');
const { authenticateToken } = require('../middleware/auth');
const { validate, validateQuery } = require('../middleware/validation');
const { authorizationSchema } = require('../validators/authorization.validator');
const { asyncHandler } = require('../middleware/errorHandler');
const Joi = require('joi');

router.use(authenticateToken);

const querySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    accountId: Joi.number().integer().optional(),
    cardNumber: Joi.string().optional(),
    responseCode: Joi.string().optional()
});

router.get('/', 
    validateQuery(querySchema),
    asyncHandler(async (req, res) => {
        const { page, limit, ...filters } = req.query;
        const result = await authorizationService.getAllAuthorizations(page, limit, filters);
        res.json(result);
    })
);

router.get('/:authId',
    asyncHandler(async (req, res) => {
        const { authId } = req.params;
        const authorization = await authorizationService.getAuthorizationById(authId);
        res.json(authorization);
    })
);

router.post('/',
    validate(authorizationSchema),
    asyncHandler(async (req, res) => {
        const authorization = await authorizationService.processAuthorization(req.body);
        res.status(201).json(authorization);
    })
);

router.delete('/:authId',
    asyncHandler(async (req, res) => {
        const { authId } = req.params;
        const result = await authorizationService.deleteAuthorization(authId);
        res.json(result);
    })
);

module.exports = router;
