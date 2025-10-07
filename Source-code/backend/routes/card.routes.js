const express = require('express');
const router = express.Router();
const cardService = require('../services/card.service');
const { authenticateToken } = require('../middleware/auth');
const { validate, validateQuery } = require('../middleware/validation');
const { cardSchema, updateCardSchema } = require('../validators/card.validator');
const { asyncHandler } = require('../middleware/errorHandler');
const Joi = require('joi');

router.use(authenticateToken);

const querySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    cardNumber: Joi.string().optional(),
    accountId: Joi.number().integer().optional(),
    customerId: Joi.number().integer().optional()
});

router.get('/', 
    validateQuery(querySchema),
    asyncHandler(async (req, res) => {
        const { page, limit, ...filters } = req.query;
        const result = await cardService.getAllCards(page, limit, filters);
        res.json(result);
    })
);

router.get('/:cardNumber',
    asyncHandler(async (req, res) => {
        const { cardNumber } = req.params;
        const card = await cardService.getCardByNumber(cardNumber);
        res.json(card);
    })
);

router.post('/',
    validate(cardSchema),
    asyncHandler(async (req, res) => {
        const card = await cardService.createCard(req.body);
        res.status(201).json(card);
    })
);

router.put('/:cardNumber',
    validate(updateCardSchema),
    asyncHandler(async (req, res) => {
        const { cardNumber } = req.params;
        const card = await cardService.updateCard(cardNumber, req.body);
        res.json(card);
    })
);

router.delete('/:cardNumber',
    asyncHandler(async (req, res) => {
        const { cardNumber } = req.params;
        const result = await cardService.deleteCard(cardNumber);
        res.json(result);
    })
);

module.exports = router;
