const express = require("express");
const taskController = require("../controller/task.controller");
const Joi = require("joi");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");
const upload = require("../config/multer")

const router = express.Router();

const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().trim().allow(),
  completed: Joi.boolean().default(false),
});

const updateTaskSchema = Joi.object({
  title: Joi.string(),          
  description: Joi.string().trim().allow(),
  completed: Joi.boolean()
});


router.post("/", auth, validate(taskSchema), taskController.createController);

router.get("/",auth, taskController.getAllController);

router.patch("/:id",  auth,validate(updateTaskSchema), taskController.updateController);

router.delete("/:id", auth, taskController.deleteController);

router.post("/:id/upload",auth, upload.single("file"), taskController.uploadImageController)

module.exports = router;