const accountService = require('../services/accountService');
const auditLogService = require('../services/auditLogService');
module.exports = {
  list: async (req, res) => {
    try {
      const accounts = await accountService.list();
      res.json(accounts);
    } catch (err) {
      await auditLogService.log({ eventType: 'error', message: 'List accounts failed', details: err });
      res.status(500).json({ error: 'List accounts failed' });
    }
  },
  get: async (req, res) => {
    try {
      const account = await accountService.get(req.params.id);
      if (!account)
        return res.status(404).json({ error: 'Account not found' });
      res.json(account);
    } catch (err) {
      await auditLogService.log({ eventType: 'error', message: 'Get account failed', details: err });
      res.status(500).json({ error: 'Get account failed' });
    }
  },
  create: async (req, res) => {
    try {
      const newA = await accountService.create(req.body);
      await auditLogService.log({ eventType: 'create', message: 'Account created', details: newA });
      res.status(201).json(newA);
    } catch (err) {
      await auditLogService.log({ eventType: 'error', message: 'Create account failed', details: err });
      res.status(500).json({ error: 'Create account failed' });
    }
  },
  update: async (req, res) => {
    try {
      const updatedA = await accountService.update(req.params.id, req.body);
      await auditLogService.log({ eventType: 'update', message: 'Account updated', details: updatedA });
      res.json(updatedA);
    } catch (err) {
      await auditLogService.log({ eventType: 'error', message: 'Update account failed', details: err });
      res.status(500).json({ error: 'Update account failed' });
    }
  },
  delete: async (req, res) => {
    try {
      const deleted = await accountService.delete(req.params.id);
      await auditLogService.log({ eventType: 'delete', message: 'Account deleted', details: deleted });
      res.json(deleted);
    } catch (err) {
      await auditLogService.log({ eventType: 'error', message: 'Delete account failed', details: err });
      res.status(500).json({ error: 'Delete account failed' });
    }
  }
};
