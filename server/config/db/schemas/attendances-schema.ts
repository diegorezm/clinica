import {
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import { doctorSchema } from "./doctor-schema";
import { patientsSchema } from "./patient-schema";
import { relations } from "drizzle-orm";

// falta,falta justificada, falta do medico, ok
export const statusEnum = pgEnum("status", ["f", "fj", "fm", "ok"]);

export const attendancesSchema = pgTable(
  "attendences",
  {
    id: serial("id").primaryKey(),
    doctorId: integer("doctor_id")
      .references(() => doctorSchema.id)
      .notNull(),
    patientId: integer("patient_id")
      .references(() => patientsSchema.id)
      .notNull(),
    appointmentDate: timestamp("appointment_date").notNull(),
    status: statusEnum("status").default("f"),
    createdAt: timestamp("created_at", { mode: "date", precision: 3 })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      compositeIndex: index("patient_doctor_index").on(
        table.patientId,
        table.doctorId,
      ),
    };
  },
);

export const atendimentosRelations = relations(
  attendancesSchema,
  ({ one }) => ({
    medico: one(doctorSchema, {
      fields: [attendancesSchema.doctorId],
      references: [doctorSchema.id],
    }),
    paciente: one(patientsSchema, {
      fields: [attendancesSchema.patientId],
      references: [patientsSchema.id],
    }),
  }),
);
