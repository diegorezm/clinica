import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { patientReferralsTable } from "@/db/schema";
import { z } from "zod";

const selectSchema = createSelectSchema(patientReferralsTable);
export const patientReferralsTableInsertSchema = createInsertSchema(
  patientReferralsTable,
).omit({ id: true, createdAt: true, updatedAt: true });

export type PatientReferral = z.infer<typeof selectSchema>;
export type PatientReferralDTO = z.infer<
  typeof patientReferralsTableInsertSchema
>;
