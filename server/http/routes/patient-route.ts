import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { patientParser } from "../../config/db/parsers/patient-parser";
import patientService from "../services/patient-service";

export const patientRoute = new Hono();

patientRoute.post(
  "/",
  zValidator("json", patientParser.insertSchema),
  async (c) => {
    const body = c.req.valid("json");
    const patient = await patientService.create(body);
    return c.json(patient, 201);
  },
);

patientRoute.get("/rg/:rg", async (c) => {
  const rg = c.req.param("rg");
  const patient = await patientService.getByRg(rg);
  return c.json(patient, 200);
});

patientRoute.get("/id/:id{[0-9]+}", async (c) => {
  const id = Number.parseInt(c.req.param("id"));
  const patient = await patientService.getById(id);
  return c.json(patient, 200);
});

patientRoute.get("/name/:name", async (c) => {
  const name = c.req.param("name");
  const patient = await patientService.getByName(name);
  return c.json(patient, 200);
});

patientRoute.delete("/id/:id{[0-9]+}", async (c) => {
  const id = Number.parseInt(c.req.param("id"));
  await patientService.delete(id);
  return c.json(null, 200);
});
