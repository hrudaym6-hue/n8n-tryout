const auditLogService = require('../services/auditLogService');
module.exports = {
  list: async (req, res) => {
    try {
      const logs = await auditLogService.list();
      res.json(logs);
    } catch (err) {
      res.status(500).json({ error: 'List audit logs failed' });
    }
  }
};
