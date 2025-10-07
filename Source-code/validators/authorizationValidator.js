const Joi = require('joi');

const authorizationSchema = Joi.object({
    accountId: Joi.number().integer().positive().required()
        .messages({
            'number.base': 'Account ID must be a number',
            'number.integer': 'Account ID must be an integer',
            'number.positive': 'Account ID must be positive',
            'any.required': 'Account ID is required'
        }),
    
    cardNumber: Joi.string().length(16).pattern(/^[0-9]+$/).required()
        .messages({
            'string.empty': 'Card number cannot be empty',
            'string.length': 'Card number must be exactly 16 digits',
            'string.pattern.base': 'Card number must contain only digits',
            'any.required': 'Card number is required'
        }),
    
    transactionAmount: Joi.number().positive().precision(2).max(999999.99).required()
        .messages({
            'number.base': 'Transaction amount must be a number',
            'number.positive': 'Transaction amount must be positive',
            'number.max': 'Transaction amount cannot exceed 999999.99',
            'any.required': 'Transaction amount is required'
        }),
    
    merchantId: Joi.string().length(9).pattern(/^[0-9]+$/).optional().allow('', null)
        .messages({
            'string.length': 'Merchant ID must be exactly 9 digits',
            'string.pattern.base': 'Merchant ID must contain only digits'
        }),
    
    merchantName: Joi.string().max(50).optional().allow('', null)
        .messages({
            'string.max': 'Merchant name cannot exceed 50 characters'
        }),
    
    merchantCity: Joi.string().max(25).optional().allow('', null)
        .messages({
            'string.max': 'Merchant city cannot exceed 25 characters'
        }),
    
    merchantZip: Joi.string().max(10).optional().allow('', null)
        .messages({
            'string.max': 'Merchant zip code cannot exceed 10 characters'
        })
});

const validateAuthorization = (req, res, next) => {
    const { error, value } = authorizationSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));
        
        return res.status(400).json({
            error: 'Validation failed',
            details: errors
        });
    }

    req.validatedData = value;
    next();
};

module.exports = {
    validateAuthorization,
    authorizationSchema
};
