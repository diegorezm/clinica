import {
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import { medicosSchema } from "./medico-schema";
import { pacientesSchema } from "./paciente-schema";
import { relations } from "drizzle-orm";

// falta,falta justificada, falta do medico, ok
export const statusEnum = pgEnum("status", ["f", "fj", "fm", "ok"]);

export const atendimentosSchema = pgTable(
  "atendimentos",
  {
    id: serial("id").primaryKey(),
    medicoId: integer("medico_id")
      .references(() => medicosSchema.id)
      .notNull(),
    pacienteId: integer("paciente_id")
      .references(() => pacientesSchema.id)
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
  },
  (table) => {
    return {
      compositeIndex: index("paciente_medico_idx").on(
        table.pacienteId,
        table.medicoId,
      ),
    };
  },
);

export const atendimentosRelations = relations(
  atendimentosSchema,
  ({ one }) => ({
    medico: one(medicosSchema, {
      fields: [atendimentosSchema.medicoId],
      references: [medicosSchema.id],
    }),
    paciente: one(pacientesSchema, {
      fields: [atendimentosSchema.pacienteId],
      references: [pacientesSchema.id],
    }),
  }),
);
