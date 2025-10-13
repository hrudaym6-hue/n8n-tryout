const accountService = require('../services/accountService');

exports.getAccounts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, accountId, customerId, accountStatus } = req.query;
        const filters = { accountId, customerId, accountStatus };
        const result = await accountService.getAccounts(filters, parseInt(page), parseInt(limit));
        res.json(result);
    } catch (error) {
        next(error);
    }
};

exports.getAccountById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const account = await accountService.getAccountById(id);
        
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }
        
        res.json(account);
    } catch (error) {
        next(error);
    }
};

exports.updateAccount = async (req, res, next) => {
    try {
        const { id } = req.params;
        const account = await accountService.updateAccount(id, req.body);
        res.json(account);
    } catch (error) {
        next(error);
    }
};

exports.getAvailableCredit = async (req, res, next) => {
    try {
        const { id } = req.params;
        const creditInfo = await accountService.calculateAvailableCredit(id);
        res.json(creditInfo);
    } catch (error) {
        next(error);
    }
};
