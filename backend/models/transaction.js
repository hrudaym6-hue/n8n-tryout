const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Transaction = sequelize.define('Transaction', {
  id: { 
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  accountId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('deposit', 'withdrawal'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(12,2),
    allowNull: false,
    validate: { min: 0.01 }
  },
  approvedByManager: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: null
  }
}, {
  timestamps: true
});

module.exports = Transaction;
