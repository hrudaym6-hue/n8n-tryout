const accountService = require('../services/accountService');
exports.createAccount = async (req, res, next) => {
  try {
    const account = await accountService.createAccount(req.body);
    res.status(201).json(account);
  } catch (err) {
    next(err);
  }
};
