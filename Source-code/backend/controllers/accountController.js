const accountService = require('../services/accountService');

exports.getAccounts = async (req, res, next) => {
    try {
        const { accountId, customerId, accountStatus, page = 1, limit = 10 } = req.query;
        
        const filters = {};
        if (accountId) filters.accountId = accountId;
        if (customerId) filters.customerId = customerId;
        if (accountStatus) filters.accountStatus = accountStatus;

        const result = await accountService.getAccounts(filters, page, limit);
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

exports.createAccount = async (req, res, next) => {
    try {
        const account = await accountService.createAccount(req.body);
        res.status(201).json(account);
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

exports.getMonthlyInterest = async (req, res, next) => {
    try {
        const { id } = req.params;
        const interestInfo = await accountService.calculateMonthlyInterest(id);
        res.json(interestInfo);
    } catch (error) {
        next(error);
    }
};
