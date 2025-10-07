const Joi = require('joi');

const namePattern = /^[a-zA-Z\s]+$/;
const phonePattern = /^[0-9]{10}$/;
const ssnPattern = /^[0-9]{9}$/;

const customerSchema = Joi.object({
    customerId: Joi.number().integer().positive().required(),
    
    firstName: Joi.string().min(1).max(25).pattern(namePattern).required()
        .messages({
            'string.pattern.base': 'First name can only contain alphabets and spaces',
            'any.required': 'First name is required',
            'string.empty': 'First name cannot be empty'
        }),
    
    lastName: Joi.string().min(1).max(25).pattern(namePattern).required()
        .messages({
            'string.pattern.base': 'Last name can only contain alphabets and spaces',
            'any.required': 'Last name is required',
            'string.empty': 'Last name cannot be empty'
        }),
    
    dateOfBirth: Joi.date().optional(),
    
    phoneNumber: Joi.string().pattern(phonePattern).optional()
        .messages({
            'string.pattern.base': 'Phone number must be exactly 10 digits'
        }),
    
    email: Joi.string().email().max(50).optional(),
    
    addressLine1: Joi.string().max(50).optional(),
    addressLine2: Joi.string().max(50).optional(),
    city: Joi.string().max(25).optional(),
    state: Joi.string().length(2).optional(),
    zipCode: Joi.string().max(10).optional(),
    
    ficoCreditScore: Joi.number().integer().min(300).max(850).optional()
        .messages({
            'number.base': 'FICO score must be numeric',
            'number.min': 'FICO score must be at least 300',
            'number.max': 'FICO score cannot exceed 850'
        })
});

const customerUpdateSchema = Joi.object({
    firstName: Joi.string().min(1).max(25).pattern(namePattern).optional(),
    lastName: Joi.string().min(1).max(25).pattern(namePattern).optional(),
    dateOfBirth: Joi.date().optional(),
    phoneNumber: Joi.string().pattern(phonePattern).optional(),
    email: Joi.string().email().max(50).optional(),
    addressLine1: Joi.string().max(50).optional(),
    addressLine2: Joi.string().max(50).optional(),
    city: Joi.string().max(25).optional(),
    state: Joi.string().length(2).optional(),
    zipCode: Joi.string().max(10).optional(),
    ficoCreditScore: Joi.number().integer().min(300).max(850).optional()
}).min(1);

const validateCustomer = (req, res, next) => {
    const { error, value } = customerSchema.validate(req.body, {
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

const validateCustomerUpdate = (req, res, next) => {
    const { error, value } = customerUpdateSchema.validate(req.body, {
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
    validateCustomer,
    validateCustomerUpdate,
    customerSchema,
    customerUpdateSchema
};
