import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { rolesSchema } from "../schemas/user-schema";
import { z } from "zod";

const Role = {
  insertSchema: createInsertSchema(rolesSchema, {
    name: z
      .string()
      .min(3, {
        message: "O nome tem que ter mais de 3 caracteres.",
      })
      .max(20, {
        message: "Muitos caracteres.",
      }),
    permissions: z.string().array(),
  }).omit({ id: true }),
  selectSchema: createSelectSchema(rolesSchema),
};

export default Role;
