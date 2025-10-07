const Joi = require('joi');

const createUserSchema = Joi.object({
    userId: Joi.string().required().min(1).max(8).messages({
        'string.empty': 'User ID can NOT be empty...',
        'any.required': 'User ID can NOT be empty...'
    }),
    firstName: Joi.string().required().min(1).max(25).messages({
        'string.empty': 'First Name can NOT be empty...',
        'any.required': 'First Name can NOT be empty...'
    }),
    lastName: Joi.string().required().min(1).max(25).messages({
        'string.empty': 'Last Name can NOT be empty...',
        'any.required': 'Last Name can NOT be empty...'
    }),
    password: Joi.string().required().min(1).max(255).messages({
        'string.empty': 'Password can NOT be empty...',
        'any.required': 'Password can NOT be empty...'
    }),
    userType: Joi.string().required().valid('U', 'A').messages({
        'string.empty': 'User Type can NOT be empty...',
        'any.required': 'User Type can NOT be empty...',
        'any.only': 'User Type must be U or A'
    })
});

const updateUserSchema = Joi.object({
    firstName: Joi.string().min(1).max(25).messages({
        'string.empty': 'First Name can NOT be empty...'
    }),
    lastName: Joi.string().min(1).max(25).messages({
        'string.empty': 'Last Name can NOT be empty...'
    }),
    password: Joi.string().min(1).max(255).messages({
        'string.empty': 'Password can NOT be empty...'
    }),
    userType: Joi.string().valid('U', 'A').messages({
        'any.only': 'User Type must be U or A'
    })
}).min(1).messages({
    'object.min': 'Please modify to update ...'
});

const userIdSchema = Joi.object({
    userId: Joi.string().required().min(1).max(8).messages({
        'string.empty': 'Please enter User ID',
        'any.required': 'Please enter User ID'
    })
});

module.exports = {
    createUserSchema,
    updateUserSchema,
    userIdSchema
};
