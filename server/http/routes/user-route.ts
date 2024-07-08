import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import userParser, {
  userRoleParser,
} from "../../config/db/parsers/user-parser";
import userService from "../services/user-service";
import { loginParser } from "../domain/User/user-login";
import userRoleService from "../services/user-role-service";
import { ZodError } from "zod";

export const userRoute = new Hono();

userRoute.post(
  "/",
  zValidator("json", userParser.insertSchema, (result) => {
    if (!result.success) {
      throw new ZodError(result.error.issues);
    }
  }),
  async (c) => {
    const userDTO = c.req.valid("json");
    const user = await userService.register(userDTO);
    return c.json(user, 201);
  },
);

// TODO: login
userRoute.post(
  "/auth/login",
  zValidator("json", loginParser, (results) => {
    if (!results.success) {
      throw new ZodError(results.error.issues);
    }
  }),
  async (c) => {
    const loginDTO = c.req.valid("json");
    const login = await userService.login(loginDTO);
    return c.json(
      { message: login ? "logged in!" : "Wrong password!" },
      login ? 200 : 401,
    );
  },
);

userRoute.get("/", async (c) => {
  return c.status(404);
});

userRoute.get("/email/:email", async (c) => {
  const email = c.req.param("email");
  const user = await userService.getByEmail(email);
  return c.json(user, 200);
});

userRoute.get("/id/:id", async (c) => {
  const id = c.req.param("id");
  const user = await userService.getById(id);
  return c.json(user, 200);
});

userRoute.delete("/id/:id", async (c) => {
  const id = c.req.param("id");
  await userService.remove(id);
  return c.json(null, 200);
});

userRoute.put(
  "/roles",
  zValidator("json", userRoleParser.insertSchema, (results) => {
    if (!results.success) {
      throw new ZodError(results.error.issues);
    }
  }),
  async (c) => {
    const body = c.req.valid("json");
    const role = await userRoleService.assingToUser(body);
    return c.json(role, 201);
  },
);

userRoute.delete(
  "/roles",
  zValidator("json", userRoleParser.insertSchema, (results) => {
    if (!results.success) {
      throw new ZodError(results.error.issues);
    }
  }),
  async (c) => {
    const body = c.req.valid("json");
    await userRoleService.removeFromUser(body);
    return c.json(null, 200);
  },
);
