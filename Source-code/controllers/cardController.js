const Card = require('../models/Card');
const logger = require('../config/logger');

class CardController {
    async getCard(req, res) {
        try {
            const { cardNumber } = req.params;
            const card = await Card.findByCardNumber(cardNumber);

            if (!card) {
                return res.status(404).json({ error: 'Card not found' });
            }

            res.json(card);
        } catch (error) {
            logger.error('Get card error', { error: error.message, stack: error.stack });
            res.status(500).json({ error: 'Failed to fetch card', message: error.message });
        }
    }

    async getCardsByAccount(req, res) {
        try {
            const { accountId } = req.params;
            const cards = await Card.findByAccountId(accountId);

            res.json({ cards });
        } catch (error) {
            logger.error('Get cards by account error', { error: error.message });
            res.status(500).json({ error: 'Failed to fetch cards', message: error.message });
        }
    }

    async getCardsByCustomer(req, res) {
        try {
            const { customerId } = req.params;
            const cards = await Card.findByCustomerId(customerId);

            res.json({ cards });
        } catch (error) {
            logger.error('Get cards by customer error', { error: error.message });
            res.status(500).json({ error: 'Failed to fetch cards', message: error.message });
        }
    }

    async createCard(req, res) {
        try {
            const cardData = req.validatedData;
            const card = await Card.create(cardData);

            res.status(201).json(card);
        } catch (error) {
            logger.error('Create card error', { error: error.message, stack: error.stack });
            
            if (error.code === '23505') {
                return res.status(409).json({ error: 'Card number already exists' });
            }
            if (error.code === '23503') {
                return res.status(400).json({ error: 'Account or customer not found' });
            }
            
            res.status(500).json({ error: 'Failed to create card', message: error.message });
        }
    }

    async updateCard(req, res) {
        try {
            const { cardNumber } = req.params;
            const updates = req.validatedData;

            const card = await Card.update(cardNumber, updates);

            if (!card) {
                return res.status(404).json({ error: 'Card not found' });
            }

            res.json(card);
        } catch (error) {
            logger.error('Update card error', { error: error.message, stack: error.stack });
            res.status(500).json({ error: 'Failed to update card', message: error.message });
        }
    }

    async validateCard(req, res) {
        try {
            const { cardNumber } = req.params;
            const validation = await Card.validateCard(cardNumber);

            res.json(validation);
        } catch (error) {
            logger.error('Validate card error', { error: error.message });
            res.status(500).json({ error: 'Failed to validate card', message: error.message });
        }
    }
}

module.exports = new CardController();
