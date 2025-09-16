const userService = require('../services/userService');

exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.getUsers = async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
};
exports.getUser = async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
};
exports.updateUser = async (req, res) => {
  await userService.updateUser(req.params.id, req.body);
  res.json({ message: 'Updated' });
};
exports.deleteUser = async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.status(204).send();
};
