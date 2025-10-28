const User = require("../models/user.model");
const Task = require("../models/task.model");

async function getAllUsers() {
    const users = await User.find();
    return users;
}


async function getAllTasks() {
    const tasks = await Task.find();
    return tasks;
}

async function deleteUser(id) {
    const user = await User.findByIdAndDelete(id);
    return user;
}

module.exports = {getAllUsers, getAllTasks, deleteUser}