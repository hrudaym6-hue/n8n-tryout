const transactionService = require('../services/transactionService');
exports.create = async (req, res) => {
  try {
    const txn = await transactionService.createTransaction(req.body);
    res.status(201).json(txn);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
