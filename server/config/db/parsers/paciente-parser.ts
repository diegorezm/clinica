import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  encaminhamentosSchema,
  pacientesSchema,
} from "../schemas/paciente-schema";
import { z } from "zod";

const pacienteParser = {
  insertSchema: createInsertSchema(pacientesSchema, {
    rg: z
      .string()
      .min(8, {
        message: "Insira um rg válido.",
      })
      .max(8, {
        message: "Insira um rg válido.",
      }),
    nome: z
      .string()
      .min(4, {
        message: "Minimo de 4 caracteres.",
      })
      .max(255, {
        message: "Muitos caracteres.",
      }),
    convenio: z
      .string()
      .min(1, {
        message: "Insira um convenio válido.",
      })
      .max(30, {
        message: "Insira um convenio válido.",
      }),
    telefone: z
      .string()
      .min(7, {
        message: "Insira um telefone válido.",
      })
      .max(9, {
        message: "Insira um telefone válido.",
      }),
    carteirinha: z
      .string()
      .min(1, {
        message: "Insira uma carteirinha válida.",
      })
      .max(30, {
        message: "Insira uma carteirinha válida.",
      }),
  }).omit({ id: true }),
  selectSchema: createSelectSchema(pacientesSchema),
};

export const encaminhamentoParser = {
  insertSchema: createInsertSchema(encaminhamentosSchema),
  selectSchema: createSelectSchema(encaminhamentosSchema),
};

export default pacienteParser;
