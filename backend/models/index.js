const sequelize = require('../sequelize');
const User = require('./user');
const Account = require('./account');
const Transaction = require('./transaction');

// Relationships
User.hasMany(Account, { foreignKey: 'userId', as: 'accounts' });
Account.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Account.hasMany(Transaction, { foreignKey: 'accountId', as: 'transactions' });
Transaction.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });

module.exports = { User, Account, Transaction, sequelize };
