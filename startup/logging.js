import "../loggers/uncaughtExceptionLogger.js";

function logging() {
  // process.on("uncaughtException", (ex) => {
  //   console.log("WE GOT AN UNCAUGHT EXCEPTION");
  //   logger.error(ex.message, { metadata: ex });
  // });

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });
}

export default logging;
