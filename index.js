import e from "express";
import routes from "./startup/routes.js";
import db from "./startup/db.js";
import logging from "./startup/logging.js";
import config from "./startup/config.js";
import validation from "./startup/validation.js";
import logger from "./loggers/logger.js";

const app = e();

logging();
config();
routes(app);
db();
validation();

const port = process.env.PORT || 3000;
// const port = process.env.NODE_ENV === "test" ? 0 : process.env.PORT || 3000;
export const server = app.listen(port, () =>
  logger.info(`Listening to port ${port}...`)
);
