const { Transaction, Account } = require('../models');
const { createTransaction } = require('../validation/transactionValidation');
exports.createTransaction = async (data) => {
  const { error } = createTransaction.validate(data);
  if (error) throw new Error(error.details[0].message);
  const account = await Account.findByPk(data.accountId);
  if (!account) throw new Error('Account does not exist.');
  if (data.amount < 0 && Math.abs(data.amount) > account.balance)
    throw new Error('Insufficient funds');
  account.balance += data.amount;
  await account.save();
  return Transaction.create(data);
};
