const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(data) {
    const { email, password, nome } = data;
    const exists = await User.findOne({ email });

    if (exists) {
        const error = new Error("Email già presente");
        error.code = "EMAIL_EXISTS";
        throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ email, passwordHash, nome })
    return user;
}

async function login(data) {
    const { email, password } = data;

    const user = await User.findOne({ email });
    const ok = await bcrypt.compare(password, user.passwordHash);

    if (!user || !ok) {
        const error = new Error("Credenziali sbagliate!");
        error.code = "INVALID_INPUT";
        throw error;
    }

    const token = jwt.sign(
        { userId: user._id.toString(), nome: user.nome },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    )

    return {
        id: user._id,
        email: user.email,
        nome: user.nome,
        token
    };

}
module.exports = { register, login }