import e from "express";
import Transaction from "mongoose-transactions";
import { Rental, rentalSchema, validate } from "../models/rental.js";
import { Customer } from "../models/customer.js";
import { Movie, movieSchema } from "../models/movie.js";

const router = e.Router();

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  // Validate schema with Joi
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock");

  let rental = new Rental({
    customer: {
      _id: customer.id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie.id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  const transaction = new Transaction();

  try {
    transaction.insert("Rental", rentalSchema, rental);
    transaction.update("Movie", movieSchema, movie.id, {
      numberInStock: --movie.numberInStock,
    });
    const result = await transaction.run(); //Array of updated documents
    rental = result[0];
    res.send(rental);
  } catch (error) {
    res.status(500).send(error);
    const rollbackObj = await transaction
      .rollback()
      .catch((err) => console.log(err));
    transaction.clean();
  }

  //   rental = await rental.save();
  //   movie.numberInStock--;
  //   movie.save();
  //   res.send(rental);
});

export default router;
