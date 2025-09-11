const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Customer = sequelize.define('Customer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  accountNumber: { type: DataTypes.STRING(10), allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.INTEGER, allowNull: false },
  balance: { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
  status: { type: DataTypes.ENUM('ACTIVE', 'OVERDRAFT'), allowNull: false, defaultValue: 'ACTIVE' },
  openDate: { type: DataTypes.DATEONLY, allowNull: true }
}, {
  tableName: 'customers',
  timestamps: true,
});

module.exports = Customer;
