const { Account, User } = require('../models');

async function createAccount(data) {
  return Account.create(data);
}
async function getAllAccounts() {
  return Account.findAll({ include: [{ model: User, as: 'user' }] });
}
async function getAccountById(id) {
  return Account.findByPk(id, { include: [{ model: User, as: 'user' }] });
}
async function updateAccount(id, data) {
  return Account.update(data, { where: { id } });
}
async function deleteAccount(id) {
  return Account.destroy({ where: { id } });
}

module.exports = { createAccount, getAllAccounts, getAccountById, updateAccount, deleteAccount };
