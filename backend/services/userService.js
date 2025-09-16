const { User } = require('../models');

async function createUser(data) {
  return User.create(data);
}
async function getAllUsers() {
  return User.findAll();
}
async function getUserById(id) {
  return User.findByPk(id);
}
async function updateUser(id, data) {
  return User.update(data, { where: { id } });
}
async function deleteUser(id) {
  return User.destroy({ where: { id } });
}

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };
