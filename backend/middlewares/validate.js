const Joi = require('joi');

// Validation schemas based on validation-rules.json
const userSchema = Joi.object({
  name: Joi.string().min(2).max(128).required(),
  email: Joi.string().email().required()
});

const accountSchema = Joi.object({
  userId: Joi.number().required(),
  accountNumber: Joi.string().length(10).required(),
  type: Joi.string().valid('savings', 'checking').required(),
  status: Joi.string().valid('active', 'inactive'),
  balance: Joi.number().min(0)
});

const transactionSchema = Joi.object({
  accountId: Joi.number().required(),
  type: Joi.string().valid('deposit', 'withdrawal').required(),
  amount: Joi.number().min(0.01).max(100000),
  approvedByManager: Joi.boolean().allow(null)
});

function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
  };
}

module.exports = {
  validateUser: validate(userSchema),
  validateAccount: validate(accountSchema),
  validateTransaction: validate(transactionSchema)
};
