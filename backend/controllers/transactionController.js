const transactionService = require('../services/transactionService');

exports.createTransaction = async (req, res, next) => {
  try {
    const tx = await transactionService.createTransaction(req.body);
    res.status(201).json(tx);
  } catch (err) {
    next(err);
  }
};
