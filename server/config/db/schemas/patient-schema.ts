import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const patientsSchema = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 14 }).notNull(),
  rg: varchar("rg", { length: 12 }),
  insurance: varchar("insurance", { length: 185 }),
  insuranceNumber: varchar("insuranceNumber", { length: 30 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
