const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Transaction = sequelize.define('Transaction', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  description: { type: DataTypes.STRING },
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  accountId: { type: DataTypes.INTEGER, allowNull: false }
}, {});
module.exports = Transaction;
