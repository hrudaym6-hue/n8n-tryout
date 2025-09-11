const accountService = require('../services/accountService');
exports.create = async (req, res) => {
  try {
    const account = await accountService.createAccount(req.body);
    res.status(201).json(account);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.get = async (req, res) => {
  try {
    const account = await accountService.getAccount(req.params.id);
    res.json(account);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
