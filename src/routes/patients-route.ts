import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { HTTPException } from "hono/http-exception";
import { paginatedRequestSchema } from "./index";
import { patientInsertSchema } from "@/models/Patient";
import patientService from "@/services/patient-service";

const app = new Hono()
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().transform(Number).optional(),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      if (!id) {
        throw new HTTPException(400, {
          message: "Parâmetro 'id' está vazio.",
        });
      }
      const data = await patientService.getById(id);
      return c.json({ data });
    },
  )
  .get("/", zValidator("query", paginatedRequestSchema), async (c) => {
    const { q, page, size } = c.req.valid("query");
    const body = await patientService.getAll({ q, page, size });
    return c.json(body);
  })
  .post("/", zValidator("json", patientInsertSchema), async (c) => {
    const body = c.req.valid("json");
    const data = await patientService.create(body);
    return c.json({ data });
  })
  .put("/:id", zValidator("json", patientInsertSchema), async (c) => {
    const body = c.req.valid("json");
    const id = Number(c.req.param("id"));
    const data = await patientService.update(body, id);
    return c.json({ data });
  })
  .delete("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    await patientService.delete(id);
    return c.status(200);
  })
  .post(
    "/bulk-delete",
    zValidator(
      "json",
      z.object({
        ids: z.array(z.number()),
      }),
    ),
    async (c) => {
      const { ids } = c.req.valid("json");
      await patientService.bulkDelete(ids);
      return c.json(ids);
    },
  );

export default app;
