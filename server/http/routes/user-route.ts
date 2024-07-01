import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import userParser from "../../config/db/parsers/user-parser";
import userService from "../services/user-service";
import { loginParser } from "../domain/User/user-login";

export const userRoute = new Hono();

userRoute.post("/", zValidator("json", userParser.insertSchema), async (c) => {
  const userDTO = c.req.valid("json");
  const user = await userService.register(userDTO);
  return c.json(user, 201);
});

// TODO: login
userRoute.post("/auth/login", zValidator("json", loginParser), async (c) => {
  const userDTO = c.req.valid("json");
  return c.json(userDTO, 201);
});

userRoute.get("/", async (c) => {
  return c.status(404);
});
userRoute.get("/email/search/:email", async (c) => {
  const email = c.req.param("email");
  const user = await userService.getByEmail(email);
  return c.json(user, 200);
});
userRoute.get("/id/search/:id", async (c) => {
  const id = c.req.param("id");
  const user = await userService.getById(id);
  return c.json(user, 200);
});
