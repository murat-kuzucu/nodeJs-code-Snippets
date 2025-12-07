const winston = require("winston");
const express = require("express");
const app = express();

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
    defaultMeta: {
        service: "user-service",
    },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                logFormat
            ),
        }), // log to the console
        new winston.transports.File({
            filename: "error.log",
            level: "error",
            format: winston.format.combine(
                winston.format.timestamp(), 
                winston.format.json()
            ),
        }), // log errors to a file
        new winston.transports.File({
            filename: "info.log",
            level: "info",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
        }), // log info-level+ logs to a file
    ],
});

app.use((req, res, next) => {
    //logs all requests to the console
    res.on("finish", () => {
        logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}`);
    });
    next(); // continue to the next middleware
});
app.use(express.json()); // parse json bodies
const PORT = 3000;

app.get("/", (req, res) => {
    logger.info("Hello World"); // log a message
    res.send("Hello World"); // send a response
});

app.listen(PORT, () => {
    logger.info("Server is running on port 3000"); // log a message
});
