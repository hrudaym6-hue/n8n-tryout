const { User } = require('../models');
const { createUser } = require('../validation/userValidation');
exports.createUser = async (data) => {
  const { error } = createUser.validate(data);
  if (error) throw new Error(error.details[0].message);
  return User.create(data);
};
exports.getUser = async (id) => User.findByPk(id);
