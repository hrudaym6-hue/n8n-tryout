const Joi = require('joi');
exports.createAccount = Joi.object({
  accountNumber: Joi.string().required(),
  type: Joi.string().required(),
  balance: Joi.number().min(0).default(0),
  userId: Joi.number().integer().required()
});
