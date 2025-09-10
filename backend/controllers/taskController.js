const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require('../services/taskService');
const { createTaskSchema, updateTaskSchema } = require('../validations/taskValidation');

const create = async (req, res) => {
  try {
    const { error, value } = createTaskSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const task = await createTask(value);
    return res.status(201).json(task);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const list = async (req, res) => {
  try {
    const { status } = req.query;
    const tasks = await getTasks(status ? { status } : {});
    return res.json(tasks);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const get = async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    return res.json(task);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const update = async (req, res) => {
  try {
    const { error, value } = updateTaskSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const task = await updateTask(req.params.id, value);
    return res.json(task);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
const remove = async (req, res) => {
  try {
    const result = await deleteTask(req.params.id);
    if (!result) return res.status(404).json({ error: 'Task not found' });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  create,
  list,
  get,
  update,
  remove
};
