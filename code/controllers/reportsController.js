const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
module.exports = {
  monthlyStatements: async (req, res) => {
    try {
      const { month, year, accountId } = req.query;
      if (!month || !year || !accountId) return res.status(400).json({ error: 'Missing required parameters' });
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59, 999);
      const account = await Account.findOne({ accountId });
      if (!account) return res.status(404).json({ error: 'Account not found' });
      const txns = await Transaction.find({ accountId, performedAt: { : start, : end } });
      res.json({ account, transactions: txns });
    } catch (err) {
      res.status(500).json({ error: 'Failed to generate monthly statement' });
    }
  }
};
