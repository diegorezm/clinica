import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { rolesSchema } from "../schemas/roles-schema";

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
