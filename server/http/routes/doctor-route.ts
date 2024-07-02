import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import doctorParser from "../../config/db/parsers/doctor-parser";
import doctorService from "../services/doctor-service";

const doctorRoute = new Hono();

doctorRoute.post(
  "/",
  zValidator("json", doctorParser.insertSchema),
  async (c) => {
    const body = c.req.valid("json");
    const doctor = await doctorService.create(body);
    return c.json(doctor, 201);
  },
);

doctorRoute.get("/id/:id{[0-9]+}", async (c) => {
  const id = Number.parseInt(c.req.param("id"));
  const doctor = await doctorService.getById(id);
  return c.json(doctor, 200);
});

doctorRoute.get("/crm/:crm", async (c) => {
  const crm = c.req.param("crm");
  const doctor = await doctorService.getByCRM(crm);
  return c.json(doctor, 200);
});

doctorRoute.get("/name/:name", async (c) => {
  const name = c.req.param("name");
  const doctor = await doctorService.getByNome(name);
  return c.json(doctor, 200);
});

doctorRoute.delete("/id/:id{[0-9]+}", async (c) => {
  const id = Number.parseInt(c.req.param("id"));
  await doctorService.remove(id);
  return c.json(null, 200);
});
