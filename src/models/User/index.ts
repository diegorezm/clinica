import { z } from "zod";
import { usersTable } from "@/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const userSelectSchema = createSelectSchema(usersTable).omit({
  password: true,
});

export const userInsertSchema = createInsertSchema(usersTable, {
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
}).omit({
  createdAt: true,
  updatedAt: true,
  id: true,
});

export type User = z.infer<typeof userSelectSchema>;
export type UserDTO = z.infer<typeof userInsertSchema>;
