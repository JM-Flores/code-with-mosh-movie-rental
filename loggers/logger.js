import winston from "winston";
// import "winston-mongodb";

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: "logfile.log" }),
    new winston.transports.Console({ format: winston.format.simple() }),
    // new winston.transports.MongoDB({
    //   db: "mongodb://localhost/vidly",
    //   collection: "log",
    //   // level: "error",
    //   options: { useUnifiedTopology: true },
    //   format: winston.format.combine(
    //     winston.format.timestamp(),
    //     winston.format.json() // Log in JSON format
    //   ),
    // }),
  ],
});

export default logger;
