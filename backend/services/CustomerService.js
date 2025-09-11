const Customer = require('../models/Customer');
const { Op } = require('sequelize');

module.exports = {
  async create(data) {
    if (await Customer.findOne({ where: { accountNumber: data.accountNumber } })) {
      throw new Error('Account number already exists.');
    }
    data.status = data.balance >= 0 ? 'ACTIVE' : 'OVERDRAFT';
    if (data.isNewAccount) data.openDate = new Date();
    return await Customer.create(data);
  },
  async findAll() {
    return await Customer.findAll();
  },
  async findById(id) {
    const customer = await Customer.findByPk(id);
    if (!customer) throw new Error('Customer not found');
    return customer;
  },
  async update(id, data) {
    const customer = await Customer.findByPk(id);
    if (!customer) throw new Error('Customer not found');
    if ('balance' in data) {
      data.status = data.balance >= 0 ? 'ACTIVE' : 'OVERDRAFT';
    }
    await customer.update(data);
    return customer;
  },
  async remove(id) {
    const customer = await Customer.findByPk(id);
    if (!customer) throw new Error('Customer not found');
    await customer.destroy();
  }
} 
