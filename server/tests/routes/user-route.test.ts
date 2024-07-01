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

  test.if(DEV_ENV)("valid POST", async () => {
    const { res, json } = await createUser();
    expect(res.status).toBe(201);
    expect(json).toBeObject();
    expect(json).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      email: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  test.if(DEV_ENV)("invalid POST", async () => {
    const userDTO = { hey: "hello" };
    try {
      const res = await app.request("/api/users", {
        method: "POST",
        body: JSON.stringify(userDTO),
        headers: new Headers({ "Content-Type": "application/json" }),
      });
      expect(res.status).toBe(400);
    } catch (e) {
      expect(e).toBeInstanceOf(ZodError);
    }
  });

  test.if(DEV_ENV)("valid GET user by email and id", async () => {
    const { res: postRes, json: postJson } = await createUser();
    expect(postRes.status).toBe(201);

    // email
    let res = await app.request(`/api/users/email/${postJson.email}`, {
      method: "GET",
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    let json = await res.json();
    let parsedJson = userParser.selectSchema.parse(json);
    expect(res.status).toBe(200);
    expect(parsedJson).toMatchObject({
      id: postJson.id,
      name: postJson.name,
      email: postJson.email,
      createdAt: postJson.createdAt,
      updatedAt: postJson.updatedAt,
    });

    // id
    res = await app.request(`/api/users/id/${postJson.id}`, {
      method: "GET",
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    json = await res.json();
    parsedJson = userParser.selectSchema.parse(json);
    expect(res.status).toBe(200);
    expect(parsedJson).toMatchObject({
      id: postJson.id,
      name: postJson.name,
      email: postJson.email,
      createdAt: postJson.createdAt,
      updatedAt: postJson.updatedAt,
    });
  });

  test.if(DEV_ENV)("invalid GET user by email and id", async () => {
    // email
    let res = await app.request(`/api/users/email/myemail@email.com`, {
      method: "GET",
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    let json = await res.json();
    expect(res.status).toBe(404);
    expect(json).toMatchObject({
      message: expect.any(String),
    });
    // id
    res = await app.request(
      `/api/users/id/4e40617e-0998-44ec-a961-ced98469a420`,
      {
        method: "GET",
        headers: new Headers({ "Content-Type": "application/json" }),
      },
    );
    json = await res.json();
    expect(res.status).toBe(404);
    expect(json).toMatchObject({
      message: expect.any(String),
    });
  });

  test.if(DEV_ENV)("valid DELETE user by id", async () => {
    const { res: postRes, json: postJson } = await createUser();
    expect(postRes.status).toBe(201);
    let response = await app.request(`/api/users/id/${postJson.id}`, {
      method: "DELETE",
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    expect(response.status).toBe(200);
  });

  test.if(DEV_ENV)("invalid DELETE user by id", async () => {
    let response = await app.request(
      `/api/users/id/4e40617e-0998-44ec-a961-ced98469a420`,
      {
        method: "DELETE",
        headers: new Headers({ "Content-Type": "application/json" }),
      },
    );
    expect(response.status).toBe(404);
  });
});
