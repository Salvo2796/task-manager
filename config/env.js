require("dotenv").config();

const env = {
    nodeEnv: process.env.NODE_ENV || "deveopment",
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN
};

['mongoUri', 'jwtSecret', "jwtExpiresIn"].forEach((k) => {
 if (!env[k]) {
 console.error(` Variabile d'ambiente mancante: ${k.toUpperCase()}`);
 process.exit(1);
 }
});

module.exports = env;