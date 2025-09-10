const mongoose = require('mongoose');
const AccountSchema = new mongoose.Schema({
  accountId: { type: String, required: true, unique: true },
  customerId: { type: String, required: true },
  type: { type: String, required: true },
  balance: { type: Number, required: true, default: 0 },
  openedAt: { type: Date, default: Date.now },
  status: { type: String, default: 'active' }
});
module.exports = mongoose.model('Account', AccountSchema);
