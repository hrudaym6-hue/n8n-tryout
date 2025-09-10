const mongoose = require('mongoose');
const AuditLogSchema = new mongoose.Schema({
  eventType: { type: String, required: true },
  message: { type: String, required: true },
  details: { type: Object },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('AuditLog', AuditLogSchema);
