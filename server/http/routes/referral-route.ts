import { Hono } from "hono";
import referralService from "../services/referral-service";
import { zValidator } from "@hono/zod-validator";
import referralsParser from "../../config/db/parsers/referrals-parser";
import { ZodError } from "zod";

export const referralRoute = new Hono();

referralRoute.get("/id/:id", async (c) => {
  const id = c.req.param("id");
  const referral = await referralService.getById(id);
  return c.json(referral, 200);
});

referralRoute.get("/patient/:patientId{[0-9]+}", async (c) => {
  const patientId = Number.parseInt(c.req.param("patientId"));
  const referral = await referralService.getByPatient(patientId);
  return c.json(referral, 200);
});

referralRoute.get("/crm/:crm", async (c) => {
  const crm = c.req.param("crm");
  const referral = await referralService.getByCrm(crm);
  return c.json(referral, 200);
});

referralRoute.get("/cid/:cid", async (c) => {
  const cid = c.req.param("cid");
  const referral = await referralService.getByCid(cid);
  return c.json(referral, 200);
});

referralRoute.post(
  "/",
  zValidator("json", referralsParser.insertSchema, (results) => {
    if (!results.success) {
      throw new ZodError(results.error.issues);
    }
  }),
  async (c) => {
    const body = c.req.valid("json");
    const referral = await referralService.create(body);
    return c.json(referral, 201);
  },
);

referralRoute.delete("/id/:id", async (c) => {
  const id = c.req.param("id");
  await referralService.delete(id);
  return c.json(null, 200);
});
