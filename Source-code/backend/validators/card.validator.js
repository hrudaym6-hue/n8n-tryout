const Joi = require('joi');

const namePattern = /^[a-zA-Z\s]+$/;

const cardSchema = Joi.object({
    accountId: Joi.number().integer().required().messages({
        'any.required': 'Account ID is required'
    }),
    customerId: Joi.number().integer().required().messages({
        'any.required': 'Customer ID is required'
    }),
    cardType: Joi.string().optional().max(10).allow(null, ''),
    expiryMonth: Joi.string().required().length(2).custom((value, helpers) => {
        const month = parseInt(value);
        if (month < 1 || month > 12) {
            return helpers.error('any.invalid');
        }
        return value;
    }).messages({
        'any.required': 'Expiry month is required',
        'any.invalid': 'Card expiry month must be between 1 and 12'
    }),
    expiryYear: Joi.string().required().length(4).pattern(/^\d{4}$/).messages({
        'any.required': 'Expiry year is required',
        'string.pattern.base': 'Card expiry year must be a valid 4 digit year'
    }),
    cvvCode: Joi.string().optional().length(3).pattern(/^\d{3}$/).allow(null, ''),
    embossedName: Joi.string().required().min(1).max(50).pattern(namePattern).messages({
        'string.empty': 'Card name not provided',
        'any.required': 'Card name not provided',
        'string.pattern.base': 'Card name can only contain alphabets and spaces'
    }),
    cardStatus: Joi.string().required().valid('Y', 'N').messages({
        'any.only': 'Card Active Status must be Y or N',
        'any.required': 'Card status is required'
    }),
    isPrimary: Joi.string().optional().valid('Y', 'N').default('N')
});

const updateCardSchema = Joi.object({
    cardType: Joi.string().max(10).allow(null, ''),
    expiryMonth: Joi.string().length(2).custom((value, helpers) => {
        const month = parseInt(value);
        if (month < 1 || month > 12) {
            return helpers.error('any.invalid');
        }
        return value;
    }).messages({
        'any.invalid': 'Card expiry month must be between 1 and 12'
    }),
    expiryYear: Joi.string().length(4).pattern(/^\d{4}$/).messages({
        'string.pattern.base': 'Card expiry year must be a valid 4 digit year'
    }),
    cvvCode: Joi.string().length(3).pattern(/^\d{3}$/).allow(null, ''),
    embossedName: Joi.string().min(1).max(50).pattern(namePattern).messages({
        'string.pattern.base': 'Card name can only contain alphabets and spaces'
    }),
    cardStatus: Joi.string().valid('Y', 'N').messages({
        'any.only': 'Card Active Status must be Y or N'
    }),
    isPrimary: Joi.string().valid('Y', 'N')
});

const cardNumberSchema = Joi.object({
    cardNumber: Joi.string().required().length(16).pattern(/^\d{16}$/).messages({
        'string.empty': 'Card number not provided',
        'any.required': 'Card number not provided',
        'string.length': 'CARD ID FILTER,IF SUPPLIED MUST BE A 16 DIGIT NUMBER',
        'string.pattern.base': 'CARD ID FILTER,IF SUPPLIED MUST BE A 16 DIGIT NUMBER'
    })
});

module.exports = {
    cardSchema,
    updateCardSchema,
    cardNumberSchema
};
