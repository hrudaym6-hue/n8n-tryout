const Customer = require('../models/Customer');
module.exports = {
  list: () => Customer.find({}),
  get: (id) => Customer.findOne({ customerId: id }),
  create: (data) => Customer.create(data),
  update: (id, data) => Customer.findOneAndUpdate({ customerId: id }, data, { new: true }),
  delete: (id) => Customer.findOneAndDelete({ customerId: id })
};
