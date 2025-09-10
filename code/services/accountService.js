const Account = require('../models/Account');
module.exports = {
  list: () => Account.find({}),
  get: (id) => Account.findOne({ accountId: id }),
  create: (data) => Account.create(data),
  update: (id, data) => Account.findOneAndUpdate({ accountId: id }, data, { new: true }),
  delete: (id) => Account.findOneAndDelete({ accountId: id })
};
