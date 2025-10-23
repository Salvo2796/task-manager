const {createLogger, transports, format} = require("winston");

const logRequest = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({
            format: () => new Date().toLocaleString()
        }),
        format.printf(info => `${info.timestamp} [${info.level}] ${info.message}`)
    ),
    transports: [
        new transports.Console(),
        new transports.File( {filename: "server.log"})
    ]
});

module.exports = logRequest;