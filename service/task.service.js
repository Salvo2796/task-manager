const Task = require("../models/task.model");

async function crea(data, userId) {
    const { title, description, completed, image } = data;
    const task = await Task.create({ title, description, completed, image, owner: userId });
    return task
}

async function getAll(userId) {
    const task = await Task.find({ owner: userId });
    return task;
}

async function update(id, data, userId) {
    const task = await Task.findOneAndUpdate(
        { _id: id, owner: userId },
        data,
        { new: true, runValidators: true }
    );
    return task;
}

async function deleteTask(id, userId) {
    const task = await Task.findOneAndDelete({ _id: id, owner: userId });
    return task;
}

async function uploadImage(taskId, userId, file) {
  // Verifica che il task appartenga all'utente
  const task = await Task.findOneAndUpdate(
    { _id: taskId, owner: userId },
    {
      image: {
        originalName: file.originalname,   // corretto nome proprietà multer
        storedName: file.filename,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size
      }
    },
    { new: true, runValidators: true }
  );

  return task;
}




module.exports = { crea, getAll, update, deleteTask, uploadImage }