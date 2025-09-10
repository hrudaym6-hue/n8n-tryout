const Transaction = require('../models/Transaction');
module.exports = {
  list: () => Transaction.find({}),
  create: (data) => Transaction.create(data)
};
