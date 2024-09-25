import e from "express";
import Joi from "joi";
import auth from "../middleware/auth";
import { Movie } from "../models/movie";
import { Rental } from "../models/rental";

const router = e.Router();

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental)
    return res
      .status(404)
      .send("Rental with given customerId/movieId is not found");

  if (rental.dateReturned)
    return res.status(400).send("Rental already processed");

  rental.return();

  await rental.save();

  await Movie.findByIdAndUpdate(rental.movie._id, {
    $inc: { numberInStock: 1 },
  });

  res.send(rental);
});

const validate = (req) => {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(req);
};

export default router;
