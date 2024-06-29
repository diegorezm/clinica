import { integer, pgEnum, pgTable } from "drizzle-orm/pg-core";
import { doctorSchema } from "./doctor-schema";

export const periodEnum = pgEnum("periods", ["m", "t", "n"]);
export const periodsSchema = pgTable("period", {
  doctorId: integer("doctor_id")
    .references(() => doctorSchema.id, {
      onDelete: "cascade",
    })
    .notNull(),
  period: periodEnum("period").notNull().notNull(),
});
