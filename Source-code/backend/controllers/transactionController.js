const transactionService = require('../services/transactionService');

exports.getTransactions = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, accountId, cardNumber, startDate, endDate } = req.query;
        const filters = { accountId, cardNumber, startDate, endDate };
        const result = await transactionService.getTransactions(filters, parseInt(page), parseInt(limit));
        res.json(result);
    } catch (error) {
        next(error);
    }
};

exports.getTransactionById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const transaction = await transactionService.getTransactionById(id);
        
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        
        res.json(transaction);
    } catch (error) {
        next(error);
    }
};

exports.createTransaction = async (req, res, next) => {
    try {
        const transaction = await transactionService.createTransaction(req.body);
        res.status(201).json(transaction);
    } catch (error) {
        next(error);
    }
};
