const accountService = require('../services/accountService');

exports.createAccount = async (req, res) => {
  try {
    const account = await accountService.createAccount(req.body);
    res.status(201).json(account);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.getAccounts = async (req, res) => {
  const accounts = await accountService.getAllAccounts();
  res.json(accounts);
};
exports.getAccount = async (req, res) => {
  const account = await accountService.getAccountById(req.params.id);
  if (!account) return res.status(404).json({ error: 'Not found' });
  res.json(account);
};
exports.updateAccount = async (req, res) => {
  await accountService.updateAccount(req.params.id, req.body);
  res.json({ message: 'Updated' });
};
exports.deleteAccount = async (req, res) => {
  await accountService.deleteAccount(req.params.id);
  res.status(204).send();
};
