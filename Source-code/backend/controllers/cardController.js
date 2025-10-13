const cardService = require('../services/cardService');

exports.getCards = async (req, res, next) => {
    try {
        const { accountId, cardStatus, cardType, page = 1, limit = 10 } = req.query;
        
        const filters = {};
        if (accountId) filters.accountId = accountId;
        if (cardStatus) filters.cardStatus = cardStatus;
        if (cardType) filters.cardType = cardType;

        const result = await cardService.getCards(filters, page, limit);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

exports.getCardByNumber = async (req, res, next) => {
    try {
        const { cardNumber } = req.params;
        const card = await cardService.getCardByNumber(cardNumber);
        
        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        res.json(card);
    } catch (error) {
        next(error);
    }
};

exports.createCard = async (req, res, next) => {
    try {
        const card = await cardService.createCard(req.body);
        res.status(201).json(card);
    } catch (error) {
        next(error);
    }
};

exports.updateCard = async (req, res, next) => {
    try {
        const { cardNumber } = req.params;
        const card = await cardService.updateCard(cardNumber, req.body);
        res.json(card);
    } catch (error) {
        next(error);
    }
};
