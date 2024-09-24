import request from "supertest";
import { server } from "../../index";
import mongoose from "mongoose";
import { Genre } from "../../models/genre";
import { User } from "../../models/user";

describe("/api/genres", () => {
  beforeAll(async () => {
    await server;
  });

  afterEach(async () => {
    await Genre.deleteMany({});
    server.close();
  });
  afterAll(async () => {
    await mongoose.connection.close(); // Properly close DB connection after all tests
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);

      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a genre if valid id is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await request(server).get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 404 if the given id is invalid", async () => {
      const res = await request(server).get("/api/genres/1");
      expect(res.status).toBe(404);
    });

    it("should return 404 if no genre with the given id exist", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(server).get("/api/genres/" + id);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    it("should return 401 if client is not logged in", async () => {
      const res = await request(server)
        .post("/api/genres")
        .send({ name: "genre1" });

      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "1234" });

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      const token = new User().generateAuthToken();

      const name = new Array(52).join("a");

      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: name });

      expect(res.status).toBe(400);
    });

    it("should save the genre if it is valid", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "genre1" });

      const genre = await Genre.find({ name: "genre1" });

      expect(genre).not.toBeNull();
    });

    it("should return the genre if it is valid", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "genre1" });

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  describe("PUT /:id", () => {
    it("should return 401 if client is not logged in", async () => {
      const res = await request(server)
        .put("/api/genres/1")
        .send({ name: "genre1" });

      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      const token = new User().generateAuthToken();

      const id = new mongoose.Types.ObjectId();
      const res = await request(server)
        .put("/api/genres/" + id)
        .set("x-auth-token", token)
        .send({ name: "1234" });

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      const token = new User().generateAuthToken();

      const name = new Array(52).join("a");

      const id = new mongoose.Types.ObjectId();
      const res = await request(server)
        .put("/api/genres/" + id)
        .set("x-auth-token", token)
        .send({ name: name });

      expect(res.status).toBe(400);
    });

    it("should return 404 if the given id is invalid", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .put("/api/genres/1")
        .set("x-auth-token", token)
        .send({ name: "genre1" });
      expect(res.status).toBe(404);
    });

    it("should return 404 if no genre with the given id exist", async () => {
      const token = new User().generateAuthToken();

      const id = new mongoose.Types.ObjectId();
      const res = await request(server)
        .put("/api/genres/" + id)
        .set("x-auth-token", token)
        .send({ name: "genre1" });
      expect(res.status).toBe(404);
    });

    it("should return the genre if it is valid", async () => {
      const genre = new Genre({ name: "genre0" });
      await genre.save();

      const token = new User().generateAuthToken();
      const res = await request(server)
        .put("/api/genres/" + genre.id)
        .set("x-auth-token", token)
        .send({ name: "genre1" });

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  describe("DELETE /:id", () => {
    it("should return 401 if client is not logged in", async () => {
      const id = new mongoose.Types.ObjectId();

      const res = await request(server)
        .delete("/api/genres/" + id)
        .send();

      expect(res.status).toBe(401);
    });

    it("should return 403 if client is not an admin", async () => {
      const token = new User({ isAdmin: false }).generateAuthToken();

      const id = new mongoose.Types.ObjectId();

      const res = await request(server)
        .delete("/api/genres/" + id)
        .set("x-auth-token", token)
        .send();

      expect(res.status).toBe(403);
    });

    it("should return 404 if the given id is invalid", async () => {
      const token = new User({ isAdmin: true }).generateAuthToken();

      const res = await request(server)
        .delete("/api/genres/1")
        .set("x-auth-token", token)
        .send();
      expect(res.status).toBe(404);
    });

    it("should return 404 if no genre with the given id exist", async () => {
      const token = new User({ isAdmin: true }).generateAuthToken();

      const id = new mongoose.Types.ObjectId();
      const res = await request(server)
        .delete("/api/genres/" + id)
        .set("x-auth-token", token)
        .send();
      expect(res.status).toBe(404);
    });

    it("should return the genre if input is valid", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const token = new User({ isAdmin: true }).generateAuthToken();
      const res = await request(server)
        .delete("/api/genres/" + genre._id)
        .set("x-auth-token", token)
        .send();

      const genreInDb = await Genre.findById(genre._id);

      expect(genreInDb).toBeNull();
    });

    it("should return the removed genre", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const token = new User({ isAdmin: true }).generateAuthToken();
      const res = await request(server)
        .delete("/api/genres/" + genre._id)
        .set("x-auth-token", token)
        .send();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });
  });
});
