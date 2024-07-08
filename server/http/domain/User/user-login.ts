import { z } from "zod";

export const loginParser = z.object({
  email: z
    .string({ message: "Insira um email válido." })
    .email({ message: "Insira um email válido." })
    .min(7, {
      message: "Insira um email válido.",
    })
    .max(255, {
      message: "Muitos caracteres.",
    }),
  password: z
    .string({ message: "Insira uma senha válida." })
    .min(6, {
      message: "Senha muito fraca.",
    })
    .max(255, {
      message: "Muitos caracteres.",
    }),
});

export type LoginDTO = z.infer<typeof loginParser>;
