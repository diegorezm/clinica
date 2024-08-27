import { doctorsTable } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const doctorInsertSchema = createInsertSchema(doctorsTable, {
  crm: z.string().min(9),
  jobFunction: z.string().min(3),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Doctor = typeof doctorsTable.$inferSelect;
export type DoctorDTO = z.infer<typeof doctorInsertSchema>;
