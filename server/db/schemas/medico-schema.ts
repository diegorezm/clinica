import {
  pgTable,
  serial,
  timestamp,
  varchar,
  integer,
  pgEnum,
  uuid,
} from "drizzle-orm/pg-core";
import { atendimentosSchema } from "./atendimentos-schema";
import { relations } from "drizzle-orm";
import { usersSchema } from "./user-schema";

export const medicosSchema = pgTable("medicos", {
  id: serial("id").primaryKey(),
  funcao: varchar("funcao", { length: 128 }).notNull(),
  crm: varchar("crm", { length: 9 }).notNull(),
  userId: uuid("user_id")
    .references(() => usersSchema.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const medicoRelations = relations(medicosSchema, ({ many, one }) => ({
  atendimentos: many(atendimentosSchema),
  diasDeTrabalho: many(diasDeTrabalho),
  user: one(usersSchema, {
    fields: [medicosSchema.userId],
    references: [usersSchema.id],
  }),
}));

export const periodoEnum = pgEnum("periodo", ["m", "t", "n"]);
export const periodos = pgTable("periodos", {
  medicoId: integer("medico_id")
    .references(() => medicosSchema.id, {
      onDelete: "cascade",
    })
    .notNull(),
  periodo: periodoEnum("periodo").notNull().notNull(),
});

export const diasDaSemanaEnum = pgEnum("dias_da_semana", [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
]);

export const diasDeTrabalho = pgTable("dias_de_trabalho", {
  medicoId: integer("medico_id"),
  dia: diasDaSemanaEnum("dias_da_semana").notNull(),
});
