const Joi = require('joi');

const accountSchema = Joi.object({
    customerId: Joi.number().integer().required().messages({
        'number.base': 'Customer ID must be numeric',
        'any.required': 'Customer ID is required'
    }),
    accountStatus: Joi.string().required().valid('Y', 'N').messages({
        'any.only': 'Account Active Status must be Y or N',
        'any.required': 'Account status is required'
    }),
    accountOpenDate: Joi.date().optional().allow(null),
    accountExpiryDate: Joi.date().optional().allow(null),
    creditLimit: Joi.number().required().min(0).messages({
        'number.base': 'Credit Limit is not valid',
        'any.required': 'Credit Limit must be supplied'
    }),
    cashCreditLimit: Joi.number().optional().min(0).allow(null),
    groupId: Joi.string().optional().max(10).allow(null, '')
});

const updateAccountSchema = Joi.object({
    accountStatus: Joi.string().valid('Y', 'N').messages({
        'any.only': 'Account Active Status must be Y or N'
    }),
    creditLimit: Joi.number().min(0).messages({
        'number.base': 'Credit Limit is not valid'
    }),
    cashCreditLimit: Joi.number().min(0).allow(null),
    accountExpiryDate: Joi.date().allow(null),
    groupId: Joi.string().max(10).allow(null, '')
});

const accountIdSchema = Joi.object({
    accountId: Joi.string().required().length(11).pattern(/^\d{11}$/).messages({
        'string.empty': 'Account number not provided',
        'any.required': 'Account number not provided',
        'string.length': 'ACCOUNT FILTER,IF SUPPLIED MUST BE A 11 DIGIT NUMBER',
        'string.pattern.base': 'ACCOUNT FILTER,IF SUPPLIED MUST BE A 11 DIGIT NUMBER'
    })
});

module.exports = {
    accountSchema,
    updateAccountSchema,
    accountIdSchema
};
