const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Account = sequelize.define('Account', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  accountNumber: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true,
    validate: {
      len: [8, 12]
    }
  },
  type: {
    type: DataTypes.ENUM('savings', 'checking'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active'
  },
  balance: {
    type: DataTypes.DECIMAL(12,2),
    allowNull: false,
    defaultValue: 0.00
  }
}, {
  timestamps: true
});

module.exports = Account;
