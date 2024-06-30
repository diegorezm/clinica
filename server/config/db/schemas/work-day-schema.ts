import { integer, pgEnum, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { doctorSchema } from "./doctor-schema";

export const weekDaysEnum = pgEnum("week_days_enum", [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]);

export const workDaysSchema = pgTable(
  "work_days",
  {
    doctorId: integer("doctor_id")
      .references(() => doctorSchema.id, { onDelete: "cascade" })
      .notNull(),
    day: weekDaysEnum("week_days_enum").notNull(),
  },
  (table) => {
    return {
      cpk: primaryKey({ columns: [table.doctorId, table.day] }),
    };
  },
);
