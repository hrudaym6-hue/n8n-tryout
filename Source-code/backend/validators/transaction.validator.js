const Joi = require('joi');

const transactionSchema = Joi.object({
    accountId: Joi.number().integer().required().messages({
        'any.required': 'Account ID is required'
    }),
    cardNumber: Joi.string().required().length(16).pattern(/^\d{16}$/).messages({
        'any.required': 'Card number is required',
        'string.pattern.base': 'Card number must be 16 digits'
    }),
    transactionTypeCode: Joi.string().required().length(2).messages({
        'any.required': 'Transaction type code is required'
    }),
    transactionCategoryCode: Joi.string().required().length(2).messages({
        'any.required': 'Transaction category code is required'
    }),
    transactionSource: Joi.string().optional().max(10).allow(null, ''),
    transactionDescription: Joi.string().optional().max(100).allow(null, ''),
    transactionAmount: Joi.number().required().min(0).messages({
        'any.required': 'Transaction amount is required',
        'number.base': 'Transaction amount must be numeric',
        'number.min': 'Transaction amount must be positive'
    }),
    merchantId: Joi.string().optional().max(9).allow(null, ''),
    merchantName: Joi.string().optional().max(50).allow(null, ''),
    merchantCity: Joi.string().optional().max(25).allow(null, ''),
    merchantZip: Joi.string().optional().max(10).allow(null, ''),
    originDate: Joi.date().optional().allow(null),
    processDate: Joi.date().optional().allow(null)
});

const transactionIdSchema = Joi.object({
    transactionId: Joi.string().required().length(16).pattern(/^\d{16}$/).messages({
        'string.empty': 'Tran ID can NOT be empty...',
        'any.required': 'Tran ID can NOT be empty...',
        'string.pattern.base': 'Tran ID must be Numeric ...'
    })
});

module.exports = {
    transactionSchema,
    transactionIdSchema
};
