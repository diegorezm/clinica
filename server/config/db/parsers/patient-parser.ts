import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { patientsSchema } from "../schemas/patient-schema";
import { z } from "zod";

export const patientParser = {
  insertSchema: createInsertSchema(patientsSchema, {
    rg: z
      .string()
      .min(8, {
        message: "Insira um rg válido.",
      })
      .max(8, {
        message: "Insira um rg válido.",
      }),
    name: z
      .string()
      .min(4, {
        message: "Minimo de 4 caracteres.",
      })
      .max(255, {
        message: "Muitos caracteres.",
      }),
    insurance: z
      .string()
      .min(1, {
        message: "Insira um convenio válido.",
      })
      .max(30, {
        message: "Insira um convenio válido.",
      }),
    phone: z
      .string()
      .min(7, {
        message: "Insira um telefone válido.",
      })
      .max(9, {
        message: "Insira um telefone válido.",
      }),
    insuranceNumber: z
      .string()
      .min(1, {
        message: "Insira uma carteirinha válida.",
      })
      .max(30, {
        message: "Insira uma carteirinha válida.",
      }),
  }).omit({ id: true, createdAt: true, updatedAt: true }),
  selectSchema: createSelectSchema(patientsSchema),
};
