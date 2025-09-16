const { Transaction, Account } = require('../models');

async function createTransaction(data) {
  // BUSINESS RULES:
  // Amount > 10,000 needs manager approval
  // Withdrawal prevents negative balance
  // Inactive accounts cannot transact
  const account = await Account.findByPk(data.accountId);
  if (!account) throw new Error('Account not found');
  if (account.status === 'inactive')
    throw new Error('Cannot create transactions for inactive accounts');

  if (data.type === 'withdrawal') {
    if (parseFloat(account.balance) < parseFloat(data.amount)) {
      throw new Error('Insufficient balance');
    }
    if (parseFloat(data.amount) > 10000 && !data.approvedByManager) {
      throw new Error('Withdrawal > 10,000 requires manager approval');
    }
    await account.decrement('balance', { by: data.amount });
  } else if (data.type === 'deposit') {
    await account.increment('balance', { by: data.amount });
  }
  return Transaction.create(data);
}
async function getAllTransactions() {
  return Transaction.findAll({ include: [{ model: Account, as: 'account' }] });
}
async function getTransactionById(id) {
  return Transaction.findByPk(id, { include: [{ model: Account, as: 'account' }] });
}

async function updateTransaction(id, data) {
  return Transaction.update(data, { where: { id } });
}
async function deleteTransaction(id) {
  return Transaction.destroy({ where: { id } });
}

module.exports = { createTransaction, getAllTransactions, getTransactionById, updateTransaction, deleteTransaction };
