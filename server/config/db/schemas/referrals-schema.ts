import { index, integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { attendancesSchema } from "./attendances-schema";
import { relations } from "drizzle-orm";
import { patientsSchema } from "./patient-schema";

export const referralsSchema = pgTable(
  "referrals",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    patientId: integer("patient_id")
      .references(() => patientsSchema.id)
      .notNull(),
    crm: varchar("crm", { length: 9 }).notNull(),
    cid: varchar("cid", { length: 12 }).notNull(),
    jobFunction: varchar("job_function", { length: 128 }).notNull(),
  },
  (table) => {
    return {
      encaminhamentosIdx: index("referral_index").on(table.patientId),
    };
  },
);

// patientsSchema
export const patientRelations = relations(patientsSchema, ({ many }) => ({
  referrals: many(attendancesSchema),
}));
