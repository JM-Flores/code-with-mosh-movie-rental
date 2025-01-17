import jwt from "jsonwebtoken";
import { User } from "../../../models/user";
import c from "config";
import mongoose from "mongoose";

describe("user.generateAuthToken", () => {
  it("should return a valid JWT", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, c.get("jwtPrivateKey"));
    expect(decoded).toMatchObject(payload);
  });
});
