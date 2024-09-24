import e from "express";
import validateObjectId from "../middleware/validateObjectId.js";
import { Genre, validate } from "../models/genre.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import asyncMiddleware from "../middleware/async.js";
import mongoose from "mongoose";
const router = e.Router();

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const genres = await Genre.find().sort("name");
    res.send(genres);
  })
);

router.get(
  "/:id",
  validateObjectId,
  asyncMiddleware(async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send("Genre with given ID is not found");
    res.send(genre);
  })
);

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    // Validate schema with Joi
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({ name: req.body.name });

    genre = await genre.save();
    res.send(genre);
  })
);

router.put(
  "/:id",
  [auth, validateObjectId],
  asyncMiddleware(async (req, res) => {
    // Validate schema with Joi
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );

    if (!genre) return res.status(404).send("Genre with given ID is not found");

    res.send(genre);
  })
);

router.delete(
  "/:id",
  [auth, admin, validateObjectId],
  asyncMiddleware(async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id);

    if (!genre) return res.status(404).send("Genre with given ID is not found");

    res.send(genre);
  })
);

export default router;
