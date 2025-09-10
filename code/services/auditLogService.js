const AuditLog = require('../models/AuditLog');
module.exports = {
  log: ({ eventType, message, details }) => AuditLog.create({ eventType, message, details }),
  list: () => AuditLog.find({})
};
