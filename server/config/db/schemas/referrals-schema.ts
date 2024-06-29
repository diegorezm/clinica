import {
  index,
  integer,
  pgTable,
  primaryKey,
  varchar,
} from "drizzle-orm/pg-core";
import { attendancesSchema } from "./attendances-schema";
import { relations } from "drizzle-orm";
import { patientsSchema } from "./patient-schema";

export const referralsSchema = pgTable(
  "referrals",
  {
    crm: varchar("crm", { length: 9 }).notNull(),
    cid: varchar("cid", { length: 12 }).notNull(),
    jobFunction: varchar("job_function", { length: 128 }).notNull(),
    patientId: integer("patient_id")
      .references(() => patientsSchema.id)
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.patientId, table.crm] }),
      encaminhamentosIdx: index("referral_index").on(table.patientId),
    };
  },
);

// patientsSchema
export const patientRelations = relations(patientsSchema, ({ many }) => ({
  atendimentos: many(attendancesSchema),
}));
