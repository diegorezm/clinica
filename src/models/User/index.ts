import {z} from "zod";
import {usersTable} from "@/db/schema";
import {createInsertSchema, createSelectSchema} from "drizzle-zod";

export const userSelectSchema = createSelectSchema(usersTable);

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
    .email({message: "Insira um email válido."})
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
export type SafeUser = Omit<User, "password">;
export type UserDTO = z.infer<typeof userInsertSchema>;

export const toSafeUser = (user: User): SafeUser => {
  const safeUser: SafeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
  return safeUser;
}
