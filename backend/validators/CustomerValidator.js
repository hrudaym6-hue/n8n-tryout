const { body } = require('express-validator');

exports.createCustomer = [
  body('accountNumber')
    .isNumeric().withMessage('Account number must be numeric.')
    .isLength({ min: 10, max: 10 }).withMessage('Account number must be 10 digits.')
    .exists().withMessage('Account number is required.'),
  body('name')
    .notEmpty().withMessage('Customer name must not be blank.'),
  body('age')
    .isInt({ min: 18 }).withMessage('Customers under 18 years old cannot open accounts.'),
  body('balance')
    .isDecimal().withMessage('Balance must be a decimal value.'),
];

exports.updateCustomer = [
  body('name').optional().notEmpty().withMessage('Name must not be blank.'),
  body('age').optional().isInt({ min: 18 }).withMessage('Customer must be 18 or older.'),
  body('balance').optional().isDecimal(),
];
