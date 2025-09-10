const Task = require('../models/Task');
const { enforceStatusTransition } = require('../business/taskRules');

const createTask = async (taskData) => {
  const task = new Task(taskData);
  return await task.save();
};

const getTasks = async (filter = {}) => {
  return await Task.find(filter).sort({ dueDate: 1 });
};

const getTaskById = async (id) => {
  return await Task.findById(id);
};

const updateTask = async (id, updates) => {
  const task = await Task.findById(id);
  if (!task) throw new Error('Task not found');
  const ruleResult = enforceStatusTransition(task, updates);
  if (!ruleResult.valid) {
    throw new Error(ruleResult.message);
  }
  if (updates.status === 'completed' && task.status !== 'completed') {
    updates.completedAt = new Date();
  }
  Object.assign(task, updates);
  return await task.save();
};

const deleteTask = async (id) => {
  return await Task.findByIdAndDelete(id);
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};
