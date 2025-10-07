const Joi = require('joi');

const cardSchema = Joi.object({
    cardNumber: Joi.string().length(16).pattern(/^[0-9]+$/).required()
        .messages({
            'string.length': 'Card number must be exactly 16 digits',
            'string.pattern.base': 'Card number must contain only digits',
            'any.required': 'Card number is required'
        }),
    
    accountId: Joi.number().integer().positive().required(),
    
    customerId: Joi.number().integer().positive().required(),
    
    cardType: Joi.string().max(10).optional(),
    
    expiryMonth: Joi.string().length(2).pattern(/^(0[1-9]|1[0-2])$/).required()
        .messages({
            'string.pattern.base': 'Expiry month must be between 01 and 12',
            'any.required': 'Expiry month is required'
        }),
    
    expiryYear: Joi.string().length(4).pattern(/^(19[5-9][0-9]|20[0-9][0-9])$/).required()
        .messages({
            'string.pattern.base': 'Expiry year must be between 1950 and 2099',
            'any.required': 'Expiry year is required'
        }),
    
    cvvCode: Joi.string().length(3).pattern(/^[0-9]+$/).optional(),
    
    embossedName: Joi.string().max(50).optional(),
    
    cardStatus: Joi.string().length(1).valid('Y', 'N').required()
        .messages({
            'any.only': 'Card status must be Y or N',
            'any.required': 'Card status is required'
        }),
    
    isPrimary: Joi.string().length(1).valid('Y', 'N').default('N')
});

const cardUpdateSchema = Joi.object({
    expiryMonth: Joi.string().length(2).pattern(/^(0[1-9]|1[0-2])$/).optional(),
    expiryYear: Joi.string().length(4).pattern(/^(19[5-9][0-9]|20[0-9][0-9])$/).optional(),
    cardStatus: Joi.string().length(1).valid('Y', 'N').optional(),
    embossedName: Joi.string().max(50).optional()
}).min(1);

const validateCard = (req, res, next) => {
    const { error, value } = cardSchema.validate(req.body, {
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

const validateCardUpdate = (req, res, next) => {
    const { error, value } = cardUpdateSchema.validate(req.body, {
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
    validateCard,
    validateCardUpdate,
    cardSchema,
    cardUpdateSchema
};
