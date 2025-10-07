const cardService = require('../services/cardService');

exports.getCards = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, cardNumber, accountId, customerId, cardStatus } = req.query;
        const filters = { cardNumber, accountId, customerId, cardStatus };
        const result = await cardService.getCards(filters, parseInt(page), parseInt(limit));
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

exports.updateCard = async (req, res, next) => {
    try {
        const { cardNumber } = req.params;
        const card = await cardService.updateCard(cardNumber, req.body);
        res.json(card);
    } catch (error) {
        next(error);
    }
};
