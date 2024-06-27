import {
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import { medicos } from "./medico-schema";
import { paciente } from "./paciente-schema";
import { relations } from "drizzle-orm";

// falta,falta justificada, falta do medico, ok
export const statusEnum = pgEnum("status", ["f", "fj", "fm", "ok"]);

export const atendimentos = pgTable("atendimentos", {
  id: serial("id").primaryKey(),
  medicoId: integer("medico_id")
    .references(() => medicos.id)
    .notNull(),
  pacienteId: integer("paciente_id")
    .references(() => paciente.id)
    .notNull(),
  data: date("data").notNull(),
  status: statusEnum("status"),
  createdAt: timestamp("created_at", { mode: "date", precision: 3 })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const atendimentosRelations = relations(atendimentos, ({ one }) => ({
  medico: one(medicos, {
    fields: [atendimentos.medicoId],
    references: [medicos.id],
  }),
  paciente: one(paciente, {
    fields: [atendimentos.pacienteId],
    references: [paciente.id],
  }),
}));
