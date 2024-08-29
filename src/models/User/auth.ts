import { z } from "zod";

export const loginSchema = z.object({
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
});

export type LoginDTO = z.infer<typeof loginSchema>;
