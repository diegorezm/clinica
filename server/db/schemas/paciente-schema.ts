import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { atendimentosSchema } from "./atendimentos-schema";

export const paciente = pgTable("paciente", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  telefone: varchar("telefone", { length: 14 }).notNull(),
  rg: varchar("rg", { length: 12 }),
  convenio: varchar("convenio", { length: 185 }),
  carteirinha: varchar("carteirinha", { length: 30 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const encaminhamentos = pgTable("encaminhamentos", {
  crm: varchar("crm", { length: 9 }).notNull(),
  cid: varchar("cid", { length: 12 }).notNull(),
  funcao: varchar("funcao", { length: 255 }).notNull(),
  pacienteId: integer("paciente_id")
    .references(() => paciente.id)
    .notNull(),
});

export const pacienteRelations = relations(paciente, ({ many }) => ({
  atendimentos: many(atendimentosSchema),
}));
