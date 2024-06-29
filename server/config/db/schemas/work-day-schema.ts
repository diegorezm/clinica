import { integer, pgEnum, pgTable } from "drizzle-orm/pg-core";

export const weekDaysEnum = pgEnum("week_days_enum", [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
]);

export const workDaysSchema = pgTable("work_days", {
  medicoId: integer("doctor_id").notNull(),
  dia: weekDaysEnum("week_days_enum").notNull(),
});
