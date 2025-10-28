const adminService = require("../service/admin.service");

async function getAllUsersController(req, res, next) {
    try {
        const users = await adminService.getAllUsers();
        return res.status(200).json({users});
    } catch (err) {
        next(err);
    }
}

async function getAllTasksController(req, res, next) {
    try {
        const tasks = await adminService.getAllTasks();
        return res.status(200).json({tasks})
    } catch (err) {
        next(err);
    }
}

async function deleteUserController(req, res, next) {
    try {
        const user = await adminService.deleteUser(req.params.id);

        if(!user) return res.status(404).json({error: "NOT_FOUND"});

        return res.status(204).end();

    } catch (err) {
        next(err);
    }
}

module.exports = {getAllUsersController, getAllTasksController, deleteUserController}