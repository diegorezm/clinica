import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { HTTPException } from "hono/http-exception";
import { DrizzleError } from "drizzle-orm";
import { userRoute } from "./http/routes/user-route";
import { ZodError } from "zod";
import { patientRoute } from "./http/routes/patient-route";
import { timeout } from "hono/timeout";
import { referralRoute } from "./http/routes/referral-route";
import { doctorRoute } from "./http/routes/doctor-route";
import { attendanceRoute } from "./http/routes/attendances-route";

const NODE_ENV = process.env.NODE_ENV || "dev";
const DEV_ENV = NODE_ENV === "dev";

const app = new Hono();
app.use("/api", timeout(6000));

const apiRoutes = app.basePath("/api");
apiRoutes.route("/users", userRoute);
apiRoutes.route("/patients", patientRoute);
apiRoutes.route("/patients/referrals", referralRoute);
apiRoutes.route("/doctors", doctorRoute);
apiRoutes.route("/attendances", attendanceRoute);

if (DEV_ENV) {
  app.use("*", logger());
}

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
    return c.json(
      {
        message: "Invalid request.",
        errors: err.issues,
      },
      400,
    );
  }
  if (err instanceof DrizzleError) {
    return c.json(
      {
        message: err.message,
      },
      500,
    );
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
