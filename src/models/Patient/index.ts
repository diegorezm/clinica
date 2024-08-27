import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { patientsTable } from "@/db/schema";

export const patientInsertSchema = createInsertSchema(patientsTable, {
  name: z
    .string()
    .min(4, { message: "Não é um nome válido." })
    .max(255, { message: "Nome muito longo." }),
  phone: z.string(),
  rg: z.string().optional(),
  insurance: z.string().optional(),
  insuranceNumber: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Patient = typeof patientsTable.$inferSelect;
export type PatientDTO = z.infer<typeof patientInsertSchema>;
