import logger from "../loggers/logger.js";
import mongoose from "mongoose";
import c from "config";

function db() {
  const db = c.get("db");
  mongoose.connect(db).then(() => logger.info(`Connected to ${db}...`));
}

export default db;
