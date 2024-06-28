import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { userRolesSchema, usersSchema } from "../schemas/user-schema";
import { z } from "zod";

const userParser = {
  insertSchema: createInsertSchema(usersSchema, {
    name: z
      .string()
      .min(6, {
        message: "Nome deve conter mais de 6 caracteres.",
      })
      .max(128, {
        message: "Muitos caracteres.",
      }),
    email: z
      .string()
      .email({ message: "Insira um email válido." })
      .min(7, {
        message: "Insira um email válido.",
      })
      .max(255, {
        message: "Muitos caracteres.",
      }),
    password: z
      .string()
      .min(6, {
        message: "Senha muito fraca.",
      })
      .max(255, {
        message: "Muitos caracteres.",
      }),
  }).omit({ id: true, createdAt: true, updatedAt: true }),
  selectSchema: createSelectSchema(usersSchema).omit({ password: true }),
};

export const userRoleParser = {
  insertSchema: createInsertSchema(userRolesSchema),
  selectSchema: createSelectSchema(userRolesSchema),
};

export default userParser;
