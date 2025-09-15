const Joi = require('joi');
// User creation
const userSchema = Joi.object({
  user_id: Joi.string().min(3).max(255).required(),
  password: Joi.string().min(8).max(255).pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$/).required(),
  loyalty_level: Joi.string().optional()
});
const loginSchema = Joi.object({
  user_id: Joi.string().required(),
  password: Joi.string().required()
});
// Account creation
const accountSchema = Joi.object({
  user_id: Joi.number().required(),
  account_number: Joi.string().alphanum().required()
});
// Order creation
const orderSchema = Joi.object({
  user_id: Joi.number().required(),
  amount: Joi.number().greater(0).required(),
  backordered: Joi.boolean().default(false)
});
// Transaction creation
const transactionSchema = Joi.object({
  account_id: Joi.number().required(),
  type: Joi.string().valid('deposit', 'withdrawal', 'transfer').required(),
  amount: Joi.number().min(1).max(10000).required()
});
// Middleware wrappers
exports.validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) return next({ status: 400, message: error.details[0].message });
  next();
};
exports.validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return next({ status: 400, message: error.details[0].message });
  next();
};
exports.validateAccount = (req, res, next) => {
  const { error } = accountSchema.validate(req.body);
  if (error) return next({ status: 400, message: error.details[0].message });
  next();
};
exports.validateOrder = (req, res, next) => {
  const { error } = orderSchema.validate(req.body);
  if (error) return next({ status: 400, message: error.details[0].message });
  next();
};
exports.validateTransaction = (req, res, next) => {
  const { error } = transactionSchema.validate(req.body);
  if (error) return next({ status: 400, message: error.details[0].message });
  next();
};
