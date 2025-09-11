const Joi = require('joi');
exports.createTransaction = Joi.object({
  amount: Joi.number().required(),
  description: Joi.string(),
  accountId: Joi.number().integer().required(),
});
