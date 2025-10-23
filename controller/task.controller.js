const taskService = require("../service/task.service");

async function createController(req, res, next) {
    try {
        const task = await taskService.crea(req.body, req.user.userId);
        return res.status(201).json(task)
    } catch (err) {
        next(err)
    }
}

async function getAllController(req, res, next) {
    try {
        const task = await taskService.getAll(req.user.userId);
        return res.status(200).json({task})
    } catch (err) {
        next(err);
    }
}

async function updateController(req, res, next) {
    try {
        
        const task = await taskService.update(req.params.id ,req.body, req.user.userId)
         if (!task) return res.status(404).json({ error: "NOT_FOUND", message: "Task non trovato o non appartiene all'utente" });

        res.status(200).json({task})
    } catch (err) {
        next(err);
    }
}

async function deleteController(req, res, next) {
    try {
        const task = await taskService.deleteTask(req.params.id, req.user.userId);

        if(!task) return res.status(404).json({error: "NOT_FOUND"});

        return res.status(204).end();
    } catch (err) {
        next(err)
    }
}

async function uploadImageController(req, res, next) {
  try {
    // req.file -> viene da multer.single("image")
    const task = await taskService.uploadImage(req.params.id, req.user.userId, req.file);

    if (!task) return res.status(404).json({ error: "NOT_FOUND", message: "Task non trovato o non appartiene all'utente" });

    res.status(200).json({ task });
  } catch (err) {
    next(err);
  }
}


module.exports = {createController, getAllController, updateController, deleteController, uploadImageController};