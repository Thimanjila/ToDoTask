const Task = require("../db/taskSchema");

async function createTask(task) {
  return Task.create(task);
}

async function getTasks() {
  return Task.find();
}

async function updateTask(id, task) {
  return Task.findByIdAndUpdate(id, task, {
    new: true,
  });
}

async function deleteTask(id) {
  return Task.findByIdAndDelete(id);
}

async function completeTask(id) {
  const prevState = await Task.findById(id);
  return Task.findByIdAndUpdate(
    id,
    { completed: !prevState.completed },
    { new: true }
  );
}

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  completeTask,
};
