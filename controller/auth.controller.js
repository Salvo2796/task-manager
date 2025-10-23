const authService = require("../service/auth.service");

async function registerController(req, res, next) {
    try {
        const user = await authService.register(req.body);
        return res.status(201).json(user);
    } catch (err) {
        if (err.code === "EMAIL_EXISTS") {
            return res.status(409).json({ error: "CONFLICT", message: err.message });
        }
        next(err)
    }
}

async function loginController(req, res, next) {
    try {
        const user = await authService.login(req.body);
        return res.status(200).json(user);
    } catch (err) {
        if(err.code === "INVALID_INPUT") {
            return res.status(401).json({ error: "UNAUTHORIZED", message: err.message})
        }
        next(err);
    }
}

module.exports = { registerController, loginController }