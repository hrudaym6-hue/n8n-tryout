const mongoose = require('mongoose');
const TransactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  accountId: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'credit', 'debit'
  amount: { type: Number, required: true },
  performedAt: { type: Date, default: Date.now },
  description: { type: String }
});
module.exports = mongoose.model('Transaction', TransactionSchema);
