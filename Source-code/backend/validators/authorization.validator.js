const Joi = require('joi');

const authorizationSchema = Joi.object({
    accountId: Joi.number().integer().required().messages({
        'any.required': 'Account ID is required'
    }),
    cardNumber: Joi.string().required().length(16).pattern(/^\d{16}$/).messages({
        'any.required': 'Card number is required',
        'string.pattern.base': 'Card number must be 16 digits'
    }),
    transactionAmount: Joi.number().required().min(0).messages({
        'any.required': 'Transaction amount is required',
        'number.base': 'Transaction amount must be numeric',
        'number.min': 'Transaction amount must be positive'
    }),
    merchantId: Joi.string().optional().max(9).allow(null, ''),
    merchantName: Joi.string().optional().max(50).allow(null, ''),
    merchantCity: Joi.string().optional().max(25).allow(null, ''),
    merchantZip: Joi.string().optional().max(10).allow(null, '')
});

module.exports = {
    authorizationSchema
};
