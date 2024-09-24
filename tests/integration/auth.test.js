import request from "supertest";
import { server } from "../../index";
import mongoose from "mongoose";
import { User } from "../../models/user";
import { Genre } from "../../models/genre";

describe("auth middleware", () => {
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

  let token;

  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it("should return 401 if no token is provided", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if token is invalid", async () => {
    token = "a";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if token is invalid", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
});
