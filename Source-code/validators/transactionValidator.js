const Joi = require('joi');

const transactionSchema = Joi.object({
    accountId: Joi.number().integer().positive().required(),
    
    cardNumber: Joi.string().length(16).pattern(/^[0-9]+$/).required(),
    
    transactionTypeCode: Joi.string().length(2).pattern(/^[0-9]+$/).required()
        .messages({
            'string.pattern.base': 'Transaction type code must be numeric',
            'any.required': 'Transaction type code is required'
        }),
    
    transactionCategoryCode: Joi.string().length(2).pattern(/^[0-9]+$/).required()
        .messages({
            'string.pattern.base': 'Transaction category code must be numeric',
            'any.required': 'Transaction category code is required'
        }),
    
    transactionSource: Joi.string().max(10).optional(),
    
    transactionDescription: Joi.string().max(100).optional(),
    
    transactionAmount: Joi.number().precision(2).required()
        .custom((value, helpers) => {
            const amountStr = value.toString();
            if (!/^[+-]\d{1,8}\.\d{2}$/.test(amountStr)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .messages({
            'any.invalid': 'Transaction amount must be in format: sign + 8 digits + decimal point + 2 digits',
            'any.required': 'Transaction amount is required'
        }),
    
    merchantId: Joi.string().length(9).pattern(/^[0-9]+$/).optional()
        .messages({
            'string.pattern.base': 'Merchant ID must be numeric',
            'string.length': 'Merchant ID must be exactly 9 digits'
        }),
    
    merchantName: Joi.string().max(50).optional(),
    merchantCity: Joi.string().max(25).optional(),
    merchantZip: Joi.string().max(10).optional(),
    
    originDate: Joi.date().iso().required()
        .messages({
            'date.format': 'Origin date must be in format YYYY-MM-DD',
            'any.required': 'Origin date is required'
        }),
    
    processDate: Joi.date().iso().required()
        .messages({
            'date.format': 'Process date must be in format YYYY-MM-DD',
            'any.required': 'Process date is required'
        })
});

const validateTransaction = (req, res, next) => {
    const { error, value } = transactionSchema.validate(req.body, {
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
    validateTransaction,
    transactionSchema
};
