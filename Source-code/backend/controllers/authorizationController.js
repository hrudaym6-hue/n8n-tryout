const authorizationService = require('../services/authorizationService');

exports.processAuthorization = async (req, res, next) => {
    try {
        const result = await authorizationService.processAuthorization(req.body);
        
        if (result.responseCode === '00') {
            res.status(201).json(result);
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        next(error);
    }
};

exports.getAuthorizationsByAccount = async (req, res, next) => {
    try {
        const { accountId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const result = await authorizationService.getAuthorizationsByAccount(
            accountId, 
            parseInt(page), 
            parseInt(limit)
        );
        res.json(result);
    } catch (error) {
        next(error);
    }
};

exports.getAuthorizationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const authorization = await authorizationService.getAuthorizationById(id);
        
        if (!authorization) {
            return res.status(404).json({ error: 'Authorization not found' });
        }
        
        res.json(authorization);
    } catch (error) {
        next(error);
    }
};
