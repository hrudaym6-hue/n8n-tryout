const authorizationService = require('../services/authorizationService');

exports.getAuthorizations = async (req, res, next) => {
    try {
        const { cardNumber, accountId, status, startDate, endDate, page = 1, limit = 10 } = req.query;
        
        const filters = {};
        if (cardNumber) filters.cardNumber = cardNumber;
        if (accountId) filters.accountId = accountId;
        if (status) filters.status = status;
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;

        const result = await authorizationService.getAuthorizations(filters, page, limit);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

exports.getAuthorizationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const authorization = await authorizationService.getAuthorizationById(parseInt(id));
        
        if (!authorization) {
            return res.status(404).json({ error: 'Authorization not found' });
        }

        res.json(authorization);
    } catch (error) {
        next(error);
    }
};

exports.createAuthorization = async (req, res, next) => {
    try {
        const authorization = await authorizationService.createAuthorization(req.body);
        res.status(201).json(authorization);
    } catch (error) {
        next(error);
    }
};

exports.purgeExpiredAuthorizations = async (req, res, next) => {
    try {
        const { expiryDays = 30 } = req.body;
        const result = await authorizationService.purgeExpiredAuthorizations(parseInt(expiryDays));
        res.json(result);
    } catch (error) {
        next(error);
    }
};
