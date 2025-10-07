const authorizationService = require('../services/AuthorizationService');
const logger = require('../config/logger');

class AuthorizationController {
    async createAuthorization(req, res) {
        try {
            const authRequest = req.validatedData;
            
            logger.info('Authorization request received', { 
                accountId: authRequest.accountId,
                cardNumber: authRequest.cardNumber 
            });

            const authorization = await authorizationService.processAuthorization(authRequest);

            const statusCode = authorization.approved ? 201 : 200;
            res.status(statusCode).json(authorization);
        } catch (error) {
            logger.error('Authorization controller error', { 
                error: error.message, 
                stack: error.stack 
            });
            res.status(500).json({ 
                error: 'Failed to process authorization',
                message: error.message 
            });
        }
    }

    async getAuthorizationsByAccount(req, res) {
        try {
            const { accountId } = req.params;
            const { page, limit, cardNumber } = req.query;

            const result = await authorizationService.getAuthorizationsByAccount(
                accountId,
                { page: parseInt(page) || 1, limit: parseInt(limit) || 10, cardNumber }
            );

            res.json(result);
        } catch (error) {
            logger.error('Get authorizations error', { 
                error: error.message, 
                stack: error.stack 
            });
            res.status(500).json({ 
                error: 'Failed to fetch authorizations',
                message: error.message 
            });
        }
    }

    async purgeExpiredAuthorizations(req, res) {
        try {
            const result = await authorizationService.purgeExpiredAuthorizations();
            res.json(result);
        } catch (error) {
            logger.error('Purge authorizations error', { 
                error: error.message, 
                stack: error.stack 
            });
            res.status(500).json({ 
                error: 'Failed to purge expired authorizations',
                message: error.message 
            });
        }
    }
}

module.exports = new AuthorizationController();
