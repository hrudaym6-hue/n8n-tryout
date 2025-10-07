const Joi = require('joi');

const loginSchema = Joi.object({
    userId: Joi.string().required().min(1).max(8).messages({
        'string.empty': 'Please enter User ID',
        'any.required': 'Please enter User ID'
    }),
    password: Joi.string().required().min(1).messages({
        'string.empty': 'Please enter a Password',
        'any.required': 'Please enter a Password'
    })
});

module.exports = {
    loginSchema
};
