const express = require("express");
const authController = require("../controller/auth.controller");
const validate = require("../middleware/validate");
const Joi = require("joi");

const router = express.Router();

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    nome: Joi.string().trim(),
    role: Joi.string().trim()
})

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

router.post("/register", validate(registerSchema), authController.registerController);
router.post("/login", validate(loginSchema), authController.loginController)

module.exports = router;