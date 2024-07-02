import { describe, expect, test, afterAll, beforeAll } from "bun:test";
import { createUserDTO } from "../helpers";
import app from "../../app";
import db from "../../config/db";
import { usersSchema } from "../../config/db/schemas/user-schema";
import { ZodError } from "zod";
import userParser from "../../config/db/parsers/user-parser";

const NODE_ENV = process.env.NODE_ENV || "dev";
const DEV_ENV = NODE_ENV === "dev";

const createUser = async () => {
  const userDTO = createUserDTO();
  const res = await app.request("/api/users", {
    method: "POST",
    body: JSON.stringify(userDTO),
    headers: new Headers({ "Content-Type": "application/json" }),
  });
  const json = await res.json();
  const parsedJson = userParser.selectSchema.parse(json);
  return { res, json: parsedJson };
};

describe("Testing /users endpoint", () => {
  beforeAll(async () => {
    if (!DEV_ENV) return;
    await db.delete(usersSchema).execute();
  });

  afterAll(async () => {
    if (!DEV_ENV) return;
    await db.delete(usersSchema).execute();
  });
});
