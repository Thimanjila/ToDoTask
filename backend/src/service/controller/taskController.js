const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  completeTask,
} = require("../model/taskModel");

async function create(req, res) {
  try {
    const task = req.body;
    const newTask = await createTask(task);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function read(req, res) {
  try {
    const tasks = await getTasks();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const task = req.body;
    const updatedTask = await updateTask(id, task);
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    await deleteTask(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function complete(req, res) {
  try {
    const { id } = req.params;
    const updatedTask = await completeTask(id);
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  create,
  read,
  update,
  remove,
  complete,
};
