const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Account = sequelize.define('Account', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  accountNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  type: { type: DataTypes.STRING, allowNull: false },
  balance: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  userId: { type: DataTypes.INTEGER, allowNull: false }
}, {});
module.exports = Account;
