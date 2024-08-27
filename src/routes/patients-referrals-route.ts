import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { paginatedRequestSchema } from ".";
import patientReferralService from "@/services/patient-referral-service";
import { patientReferralsTableInsertSchema } from "@/models/Patient/patient-referral";

const app = new Hono()
  .get(
    "/info/:id",
    zValidator(
      "param",
      z.object({
        id: z.coerce.number(),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const data = await patientReferralService.getById(id);
      return c.json(data);
    },
  )
  .get(
    "/:patientId",
    zValidator(
      "param",
      z.object({
        patientId: z.coerce.number(),
      }),
    ),
    zValidator("query", paginatedRequestSchema),
    async (c) => {
      const { q, page, size } = c.req.valid("query");
      const { patientId } = c.req.valid("param");
      const data = await patientReferralService.getAll({
        q,
        page,
        size,
        patientId,
      });
      return c.json(data);
    },
  )
  .put(
    "/:id",
    zValidator("json", patientReferralsTableInsertSchema),
    async (c) => {
      const body = c.req.valid("json");
      const id = Number(c.req.param("id"));
      const response = await patientReferralService.update(body, id);
      return c.json(response);
    },
  )
  .post(
    "/",
    zValidator("json", patientReferralsTableInsertSchema),
    async (c) => {
      const body = c.req.valid("json");
      const response = await patientReferralService.create(body);
      return c.json(response);
    },
  )
  .post(
    "/bulk-delete",
    zValidator(
      "json",
      z.object({
        ids: z.number().array(),
      }),
    ),
    async (c) => {
      const { ids } = c.req.valid("json");
      await patientReferralService.bulkDelete(ids);
      return c.json(
        {
          ids,
        },
        200,
      );
    },
  );

export default app;
