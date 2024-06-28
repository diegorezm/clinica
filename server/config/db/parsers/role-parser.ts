import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { rolesSchema } from "../schemas/user-schema";
import { z } from "zod";

const roleParser = {
  insertSchema: createInsertSchema(rolesSchema, {
    name: z
      .string()
      .min(3, {
        message: "O nome tem que ter mais de 3 caracteres.",
      })
      .max(20, {
        message: "Muitos caracteres.",
      }),
    permissions: z.array(z.string(), {
      message: "Permissões devem ser uma lista de strings.",
    }),
  }).omit({ id: true, createdAt: true, updatedAt: true }),
  selectSchema: createSelectSchema(rolesSchema, {
    permissions: z.array(z.string(), {
      message: "Permissões devem ser uma lista de strings.",
    }),
  }),
};

export default roleParser;
