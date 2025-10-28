const express = require("express");
const isAdmin = require("../middleware/isAdmin");
const auth = require("../middleware/auth");
const adminController = require("../controller/admin.controller");

const router = express.Router();

router.get("/users",auth, isAdmin, adminController.getAllUsersController);
router.get("/tasks", auth, isAdmin, adminController.getAllTasksController);
router.delete("/users/:id", auth, isAdmin, adminController.deleteUserController)

module.exports =router;