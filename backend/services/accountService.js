const { Account, User } = require('../models');
const { createAccount } = require('../validation/accountValidation');
exports.createAccount = async (data) => {
  const { error } = createAccount.validate(data);
  if (error) throw new Error(error.details[0].message);
  const user = await User.findByPk(data.userId);
  if (!user) throw new Error('User does not exist');
  if (data.type === "Savings") {
    const savingsAccount = await Account.findOne({ where: { userId: data.userId, type: 'Savings' } });
    if (savingsAccount) throw new Error('Savings account already exists for user');
  }
  return Account.create(data);
};
exports.getAccount = async (id) => {
  const account = await Account.findByPk(id, { include: User });
  if (!account) throw new Error('Account not found');
  return account;
};
