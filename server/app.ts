import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { HTTPException } from "hono/http-exception";
import { DrizzleError } from "drizzle-orm";
import { userRoute } from "./http/routes/user-route";
import { ZodError } from "zod";
import { patientRoute } from "./http/routes/patient-route";

const app = new Hono();
app.use("*", logger());

const apiRoutes = app.basePath("/api");
apiRoutes.route("/users", userRoute);
apiRoutes.route("/patients", patientRoute);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json(
      {
        message: err.message,
      },
      err.status,
    );
  }
  if (err instanceof ZodError) {
    throw new HTTPException(400, { message: err.message });
  }
  if (err instanceof DrizzleError) {
    throw new HTTPException(500, { message: err.message, cause: err });
  }
  if (err instanceof Error) {
    return c.json(
      {
        messsage: err.message,
      },
      500,
    );
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
