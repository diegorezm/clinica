import { Hono } from "hono";
import { logger } from "hono/logger";
import { NODE_ENV } from "@/env";
import { ZodError } from "zod";
import { HTTPException } from "hono/http-exception";
import { DrizzleError } from "drizzle-orm";
import patientsRoute from "@/routes/patients-route";
import patientsReferralsRoute from "@/routes/patients-referrals-route";

const app = new Hono().basePath("/api");
if (NODE_ENV === "development") {
  app.use("*", logger());
}

const routes = app
  .route("/patients", patientsRoute)
  .route("/patients/referrals", patientsReferralsRoute);

app.onError((err, c) => {
  if (NODE_ENV === "development") {
    console.error(err);
  }
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

export const GET = app.fetch;
export const POST = app.fetch;
export const PUT = app.fetch;
export const DELETE = app.fetch;
export type AppType = typeof routes;
