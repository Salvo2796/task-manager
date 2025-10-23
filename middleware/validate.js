const joi = require("joi");

module.exports = function validate(schema) {
    return (req, res, next) => {
        const {error, value} = schema.validate(req.body, {abortEarly: false});

        if(error) {
            const details = error.details.map(d => d.message);
            return res.status(400).json({
                error: "INVALID_INPUT",
                message: "Dati non validi",
                details
            });
        }

        req.body = value;
        next();
    }
}
