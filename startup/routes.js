import genreRouter from "../routes/genres.js";
import customerRouter from "../routes/customers.js";
import movieRouter from "../routes/movies.js";
import rentalRouter from "../routes/rentals.js";
import userRouter from "../routes/users.js";
import authRouter from "../routes/auth.js";
import returnsRouter from "../routes/returns.js";
import e from "express";
import error from "../middleware/error.js";

function routes(app) {
  app.use(e.json());
  app.use("/api/genres", genreRouter);
  app.use("/api/customers", customerRouter);
  app.use("/api/movies", movieRouter);
  app.use("/api/rentals", rentalRouter);
  app.use("/api/users", userRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/returns", returnsRouter);
  app.use(error);
}
export default routes;
