import winston from "winston";
import "winston-mongodb";

const uncaughtExceptionLogger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: "uncaughtException.log",
      handleExceptions: true,
    }),
    new winston.transports.Console({
      format: winston.format.printf(({ message }) => message),
      handleExceptions: true,
    }),
  ],
});

export default uncaughtExceptionLogger;
