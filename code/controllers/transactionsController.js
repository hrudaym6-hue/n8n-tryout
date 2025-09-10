const transactionService = require('../services/transactionService');
const auditLogService = require('../services/auditLogService');
module.exports = {
  list: async (req, res) => {
    try {
      const txns = await transactionService.list();
      res.json(txns);
    } catch (err) {
      await auditLogService.log({ eventType: 'error', message: 'List transactions failed', details: err });
      res.status(500).json({ error: 'List transactions failed' });
    }
  },
  create: async (req, res) => {
    try {
      const txn = await transactionService.create(req.body);
      await auditLogService.log({ eventType: 'create', message: 'Transaction created', details: txn });
      res.status(201).json(txn);
    } catch (err) {
      await auditLogService.log({ eventType: 'error', message: 'Create transaction failed', details: err });
      res.status(500).json({ error: 'Create transaction failed' });
    }
  }
};
