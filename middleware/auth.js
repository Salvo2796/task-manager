const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Token mancante o invalido' })
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {userId: decoded.userId, role:decoded.role}
        
        next();
    } catch (err) {
        return res.status(401).json({error: 'UNAUTHORIZED', message: 'Token non valido o scaduto' })
    }

}
