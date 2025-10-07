const Joi = require('joi');

const userSchema = Joi.object({
    userId: Joi.string().max(8).required()
        .messages({
            'string.empty': 'User ID cannot be empty',
            'any.required': 'User ID is required'
        }),
    
    firstName: Joi.string().min(1).max(25).required()
        .messages({
            'string.empty': 'First name cannot be empty',
            'any.required': 'First name is required'
        }),
    
    lastName: Joi.string().min(1).max(25).required()
        .messages({
            'string.empty': 'Last name cannot be empty',
            'any.required': 'Last name is required'
        }),
    
    password: Joi.string().min(6).required()
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'string.empty': 'Password cannot be empty',
            'any.required': 'Password is required'
        }),
    
    userType: Joi.string().length(1).valid('U', 'A').required()
        .messages({
            'any.only': 'User type must be U (User) or A (Admin)',
            'any.required': 'User type is required'
        })
});

const userUpdateSchema = Joi.object({
    firstName: Joi.string().min(1).max(25).optional(),
    lastName: Joi.string().min(1).max(25).optional(),
    password: Joi.string().min(6).optional(),
    userType: Joi.string().length(1).valid('U', 'A').optional()
}).min(1);

const loginSchema = Joi.object({
    userId: Joi.string().required()
        .messages({
            'string.empty': 'User ID is required',
            'any.required': 'User ID is required'
        }),
    
    password: Joi.string().required()
        .messages({
            'string.empty': 'Password is required',
            'any.required': 'Password is required'
        })
});

const validateUser = (req, res, next) => {
    const { error, value } = userSchema.validate(req.body, {
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

const validateUserUpdate = (req, res, next) => {
    const { error, value } = userUpdateSchema.validate(req.body, {
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

const validateLogin = (req, res, next) => {
    const { error, value } = loginSchema.validate(req.body, {
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
    validateUser,
    validateUserUpdate,
    validateLogin,
    userSchema,
    userUpdateSchema,
    loginSchema
};
