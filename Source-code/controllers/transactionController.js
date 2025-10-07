const Transaction = require('../models/Transaction');
const logger = require('../config/logger');

class TransactionController {
    async getTransaction(req, res) {
        try {
            const { transactionId } = req.params;
            const transaction = await Transaction.findById(transactionId);

            if (!transaction) {
                return res.status(404).json({ error: 'Transaction not found' });
            }

            res.json(transaction);
        } catch (error) {
            logger.error('Get transaction error', { error: error.message, stack: error.stack });
            res.status(500).json({ error: 'Failed to fetch transaction', message: error.message });
        }
    }

    async getTransactionsByAccount(req, res) {
        try {
            const { accountId } = req.params;
            const { page, limit, startDate, endDate } = req.query;

            const result = await Transaction.findByAccountId(accountId, {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                startDate,
                endDate
            });

            res.json(result);
        } catch (error) {
            logger.error('Get transactions by account error', { error: error.message });
            res.status(500).json({ error: 'Failed to fetch transactions', message: error.message });
        }
    }

    async createTransaction(req, res) {
        try {
            const transactionData = req.validatedData;
            
            const transactionId = await Transaction.getNextTransactionId();
            transactionData.transactionId = transactionId;

            const transaction = await Transaction.create(transactionData);

            res.status(201).json(transaction);
        } catch (error) {
            logger.error('Create transaction error', { error: error.message, stack: error.stack });
            
            if (error.code === '23503') {
                return res.status(400).json({ error: 'Invalid account, card, type, or category' });
            }
            
            res.status(500).json({ error: 'Failed to create transaction', message: error.message });
        }
    }
}

module.exports = new TransactionController();
