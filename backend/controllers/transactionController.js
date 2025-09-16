const transactionService = require('../services/transactionService');

exports.createTransaction = async (req, res) => {
  try {
    const tx = await transactionService.createTransaction(req.body);
    res.status(201).json(tx);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.getTransactions = async (req, res) => {
  const txs = await transactionService.getAllTransactions();
  res.json(txs);
};
exports.getTransaction = async (req, res) => {
  const tx = await transactionService.getTransactionById(req.params.id);
  if (!tx) return res.status(404).json({ error: 'Not found' });
  res.json(tx);
};
exports.updateTransaction = async (req, res) => {
  try {
    await transactionService.updateTransaction(req.params.id, req.body);
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.deleteTransaction = async (req, res) => {
  await transactionService.deleteTransaction(req.params.id);
  res.status(204).send();
};
