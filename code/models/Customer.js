const mongoose = require('mongoose');
const CustomerSchema = new mongoose.Schema({
  customerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Customer', CustomerSchema);
