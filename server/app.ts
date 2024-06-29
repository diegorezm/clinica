import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { HTTPException } from "hono/http-exception";
import { DrizzleError } from "drizzle-orm";

const app = new Hono();
app.use("*", logger());

const apiRoutes = app.basePath("/api");

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  if (err instanceof DrizzleError) {
    throw new HTTPException(500, { message: err.message, cause: err });
  }
  return c.json(
    {
      message: "Erro inesperado.",
    },
    500,
  );
});

app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

export default app;
export type AppType = typeof apiRoutes;
