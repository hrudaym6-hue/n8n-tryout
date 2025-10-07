const Joi = require('joi');

const accountSchema = Joi.object({
    accountId: Joi.number().integer().positive().required(),
    customerId: Joi.number().integer().positive().required(),
    accountStatus: Joi.string().length(1).valid('Y', 'N').required()
        .messages({
            'any.only': 'Account status must be Y or N'
        }),
    accountOpenDate: Joi.date().optional(),
    accountExpiryDate: Joi.date().optional(),
    currentBalance: Joi.number().precision(2).default(0),
    creditLimit: Joi.number().positive().precision(2).required()
        .messages({
            'number.positive': 'Credit limit must be positive',
            'any.required': 'Credit limit is required'
        }),
    cashCreditLimit: Joi.number().precision(2).optional(),
    currentCycleCredit: Joi.number().precision(2).default(0),
    currentCycleDebit: Joi.number().precision(2).default(0),
    groupId: Joi.string().max(10).optional()
});

const accountUpdateSchema = Joi.object({
    accountStatus: Joi.string().length(1).valid('Y', 'N').optional(),
    creditLimit: Joi.number().positive().precision(2).optional(),
    cashCreditLimit: Joi.number().precision(2).optional(),
    groupId: Joi.string().max(10).optional()
}).min(1);

const validateAccount = (req, res, next) => {
    const { error, value } = accountSchema.validate(req.body, {
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

const validateAccountUpdate = (req, res, next) => {
    const { error, value } = accountUpdateSchema.validate(req.body, {
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
    validateAccount,
    validateAccountUpdate,
    accountSchema,
    accountUpdateSchema
};
